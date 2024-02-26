<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  useScroll,
  useDebounceFn,
  useEventListener,
  useStorage,
} from "@vueuse/core";
import { useSound } from "@raffaelesgarro/vue-use-sound";
import { Play as PlayIcon } from "lucide-vue-next";
import { RotateCcw as RotateCcwIcon } from "lucide-vue-next";
import dayjs from "dayjs";

import { usePlayTurnSoundFn } from "../../composables/usePlayTurnSoundFn";
import StemIcon from "../../assets/icons/stem.svg";
import turnSfx from "../../assets/sounds/turn.mp3";
import tickSfx from "../../assets/sounds/tick.mp3";
import ringSfx from "../../assets/sounds/ring.mp3";

const quantityOfTimelineMarks = 5;
const quantityOfMinutesBetweenMarks = 5;
const oneMinuteInSeconds = 60;
const timelineDecreaseRate = 0.5;
const timerStorageDefault = {
  hiddenAt: "",
  chosenInterval: 0,
  decreaseIntervalInMilliseconds: 0,
};
const timelineElement = ref<HTMLElement | null>(null);
const timer = ref({
  isTicking: false,
  hasInteracted: false,
  counter: 0,
  intervals: {
    timeline: 0,
    counter: 0,
  },
});
const { play: playTurnSfx } = useSound(turnSfx, { volume: 0.5 });
const { play: playTickSfx } = useSound(tickSfx, { volume: 0.5 });
const { play: playRingSfx } = useSound(ringSfx, { volume: 0.5 });
const { x, isScrolling } = useScroll(timelineElement, { behavior: "smooth" });
const timerStorage = useStorage("timer", timerStorageDefault, sessionStorage);
const timelineScrolledPercentage = computed(() => {
  if (!timelineElement.value) {
    return 0;
  }

  return Math.round(
    (x.value /
      (timelineElement.value.scrollWidth - timelineElement.value.offsetWidth)) *
      100,
  );
});
const timeline = Array.from({
  length: quantityOfTimelineMarks * quantityOfMinutesBetweenMarks + 1,
}).map((_, index) => {
  const isTimelineMark = index % quantityOfMinutesBetweenMarks === 0;

  if (isTimelineMark) {
    return {
      label: index.toString(),
    };
  }

  return {
    label: "",
  };
});

const resetTimer = () => {
  timer.value.isTicking = false;
  timer.value.counter = 0;
  x.value = 0;
  clearInterval(timer.value.intervals.timeline);
  clearInterval(timer.value.intervals.counter);
  timerStorage.value = timerStorageDefault;
};

const handleTimelineInterval = (
  decreaseRate: number,
  decreaseInterval: number,
) =>
  setInterval(() => {
    x.value -= decreaseRate;

    if (!x.value) {
      resetTimer();
    }

    playTickSfx();
  }, decreaseInterval);

const handleCounterInterval = (chosenTimelineInterval: number) =>
  setInterval(() => {
    timer.value.counter++;

    if (timer.value.counter === chosenTimelineInterval * oneMinuteInSeconds) {
      resetTimer();
      playRingSfx();
    }
  }, 1000);

const calculateTimelineData = () => {
  const chosenInterval = Math.round(
    (quantityOfTimelineMarks *
      quantityOfMinutesBetweenMarks *
      timelineScrolledPercentage.value) /
      100,
  );

  const decreaseIntervalInMilliseconds = Math.round(
    ((chosenInterval * oneMinuteInSeconds) / (x.value / timelineDecreaseRate)) *
      1000,
  );

  return {
    chosenInterval,
    decreaseIntervalInMilliseconds,
  };
};

const doTick = useDebounceFn(() => {
  if (timer.value.isTicking) {
    return;
  }

  const timeline = calculateTimelineData();

  if (!timeline.chosenInterval) {
    timer.value.counter = 0;
    clearInterval(timer.value.intervals.timeline);
    clearInterval(timer.value.intervals.counter);

    return;
  }

  timerStorage.value.chosenInterval = timeline.chosenInterval;
  timerStorage.value.decreaseIntervalInMilliseconds =
    timeline.decreaseIntervalInMilliseconds;
  timer.value.isTicking = true;
  timer.value.intervals.timeline = handleTimelineInterval(
    timelineDecreaseRate,
    timeline.decreaseIntervalInMilliseconds,
  );
  timer.value.intervals.counter = handleCounterInterval(
    timeline.chosenInterval,
  );
}, 1000);

const handleOnResetClick = () => {
  resetTimer();
};

useEventListener(document, "visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const now = dayjs(new Date(Date.now()).toJSON());
    const differenceInSeconds = now.diff(timerStorage.value.hiddenAt, "second");

    if (
      !differenceInSeconds ||
      !timerStorage.value.decreaseIntervalInMilliseconds
    ) {
      return;
    }

    clearInterval(timer.value.intervals.timeline);
    clearInterval(timer.value.intervals.counter);
    timer.value.counter += differenceInSeconds;
    x.value -= Math.round(
      differenceInSeconds /
        (timerStorage.value.decreaseIntervalInMilliseconds / 1000),
    );

    timer.value.intervals.timeline = handleTimelineInterval(
      timelineDecreaseRate,
      timerStorage.value.decreaseIntervalInMilliseconds,
    );
    timer.value.intervals.counter = handleCounterInterval(
      timerStorage.value.chosenInterval,
    );

    timerStorage.value = timerStorageDefault;

    return;
  }

  timerStorage.value.hiddenAt = new Date(Date.now()).toJSON();
});

watch(x, () => {
  doTick();
  usePlayTurnSoundFn(timer.value.isTicking, playTurnSfx);
});
</script>

<template>
  <div class="timer" :is-ticking="timer.isTicking">
    <StemIcon class="stem" />
    <button
      v-if="!timer.hasInteracted"
      type="button"
      class="btn-primary-rounded start-button"
      aria-describedby="start-button-description"
      @click="timer.hasInteracted = true"
    >
      <PlayIcon class="start-button-icon" />
      <span id="start-button-description">Start</span>
    </button>
    <Transition>
      <div v-if="timer.hasInteracted" class="timer-inner-wrapper">
        <div ref="timelineElement" class="timeline" :is-scrolling="isScrolling">
          <div
            v-for="(minute, index) in timeline"
            :key="index"
            class="timeline-wrapper"
          >
            <span
              class="timeline-label"
              :data-testid="`timeline-label-${index}`"
              >{{ minute.label }}</span
            >
            <span
              :class="['timeline-minute', { 'timeline-mark': minute.label }]"
            ></span>
          </div>
        </div>
        <div class="timer-pointer"></div>
        <p v-if="!timer.isTicking" class="timer-title">Pomodoro</p>
        <button
          v-else
          type="button"
          class="btn-primary-rounded reset-button"
          aria-describedby="reset-button-description"
          @click="handleOnResetClick"
        >
          <RotateCcwIcon class="reset-button-icon" />
          <span id="reset-button-description">Reset</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.start-button {
  height: 4rem;
  margin: 0 auto;
  width: 4rem;
}

.start-button span,
.reset-button span {
  display: none;
}

.start-button-icon {
  display: block;
  margin: 0 auto;
}

.reset-button {
  left: calc(50% - 1.21875rem);
  margin-bottom: 0.5625rem;
  margin-top: calc(100% - 1.5625rem);
  position: absolute;
}

.reset-button-icon {
  display: block;
  margin: 0 auto;
}

.timer {
  align-items: center;
  background-color: var(--red-500);
  border: 0.5rem solid var(--white);
  border-radius: 50%;
  display: flex;
  height: 71.11111vw;
  min-height: 12rem;
  min-width: 12rem;
  max-height: 20rem;
  max-width: 20rem;
  padding: 1rem;
  position: relative;
  width: 71.11111vw;
}

.timer-inner-wrapper {
  align-items: center;
  display: flex;
  height: 100%;
  position: relative;
  width: 100%;
}

.timer-pointer {
  border-left: 0.625rem solid transparent;
  border-right: 0.625rem solid transparent;
  border-bottom: 1.25rem solid var(--white);
  height: 0;
  position: absolute;
  left: calc(50% - 0.375rem);
  top: calc(50% + 2rem);
  width: 0;
}

.timer-title {
  align-self: flex-end;
  color: var(--white);
  display: flex;
  font-size: calc(1.275rem + 0.3vw);
  font-weight: var(--fw-semibold);
  left: calc(50% - 3.1875rem);
  margin-bottom: 0.5625rem;
  position: absolute;
}

.timeline {
  align-items: flex-end;
  display: flex;
  column-gap: 0.75rem;
  overflow-x: scroll;
  overflow-y: hidden;
  padding-left: calc(50% - 0.125rem);
  padding-right: calc(50% - 1rem);
  scrollbar-width: 0rem;
  scrollbar-color: transparent transparent;
}

.timeline::-webkit-scrollbar {
  width: 0rem;
}

.timeline::-webkit-scrollbar-track {
  background: transparent;
}

.timeline::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.timer[is-ticking="true"] .timeline {
  pointer-events: none;
  scrollbar-width: 0rem;
  scrollbar-color: transparent transparent;
}

.timer[is-ticking="true"] .timeline[is-scrolling="true"] {
  overflow-x: hidden;
}

.timer[is-ticking="true"] .timeline::-webkit-scrollbar {
  width: 0rem;
}

.timer[is-ticking="true"] .timeline::-webkit-scrollbar-track {
  background: transparent;
}

.timer[is-ticking="true"] .timeline::-webkit-scrollbar-thumb {
  background: transparent;
}

.timeline-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-minute {
  display: inline-block;
  color: var(--white);
  background-color: var(--white);
  height: 0.625rem;
  width: 0.25rem;
  text-align: center;
}

.timeline-label {
  color: var(--white);
  font-size: 1.25rem;
}

.timeline-mark {
  height: 1.125rem;
}

.stem {
  top: -59%;
  fill: var(--limegreen-500);
  height: auto;
  left: -12%;
  min-width: 12rem;
  max-width: 20rem;
  pointer-events: none;
  position: absolute;
  rotate: 8deg;
  width: 80.87777vw;
  z-index: 1;
}

@media (hover: hover) {
  .timer-pointer {
    top: calc(50% + 0.5rem);
  }

  .timeline {
    cursor: move;
    padding-bottom: 2.5rem;
    scrollbar-width: initial;
    scrollbar-color: var(--white) transparent;
  }

  .timeline::-webkit-scrollbar {
    width: initial;
  }

  .timeline::-webkit-scrollbar-track {
    background: var(--white);
  }

  .timeline::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
}

@media screen and (min-width: 576px) {
  .stem {
    top: -52%;
    left: -6%;
  }

  .timer-title {
    margin-bottom: 1.5625rem;
  }

  .reset-button {
    margin-bottom: 1.5625rem;
    margin-top: calc(100% - 2.5625rem);
  }
}
</style>
