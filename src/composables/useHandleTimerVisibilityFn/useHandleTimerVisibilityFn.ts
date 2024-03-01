import { type Ref } from "vue";
import { type RemovableRef } from "@vueuse/core";

import { useHandleTimerTimelineFn } from "../useHandleTimerTimelineFn";
import { useHandleTimerCounterFn } from "../useHandleTimerCounterFn";
import { timerConfig } from "../../config/timer";
import { storageConfig } from "../../config/storage";
import { type TimerStorage, type Timer, type PlayFunction } from "../../types";

export const helpers = {
  isBrowserEnv: () => !!window,
  isDocumentVisible: () => document.visibilityState === "visible",
};

/**
 * Handles timer behavior based on document visibility.
 * @param timer - A reference to the timer object.
 * @param timerStorage - A reference to the timer storage.
 * @param scroll - A reference to the scroll value.
 * @param options - An object containing additional options.
 * @param options.playTickFn - Optional. A function to be executed when a tick occurs.
 * @param options.playRingFn - Optional. A function to be executed when the timer rings.
 * @returns A boolean indicating whether the timer behavior was successfully handled.
 */
export const useHandleTimerVisibilityFn = (
  timer: Ref<Timer>,
  timerStorage: RemovableRef<TimerStorage>,
  scroll: Ref<number>,
  options: {
    playTickFn?: PlayFunction;
    playRingFn?: PlayFunction;
  },
) => {
  if (!helpers.isBrowserEnv()) {
    return false;
  }

  if (helpers.isDocumentVisible()) {
    const differenceInSeconds = Math.trunc(
      (Date.now() - new Date(timerStorage.value.hiddenAt).getTime()) / 1000,
    );

    if (
      !differenceInSeconds ||
      !timerStorage.value.decreaseIntervalInMilliseconds
    ) {
      return false;
    }

    clearInterval(timer.value.intervals.timeline);
    clearInterval(timer.value.intervals.counter);
    timer.value.counter += differenceInSeconds;
    scroll.value -= Math.round(
      differenceInSeconds /
        (timerStorage.value.decreaseIntervalInMilliseconds / 1000),
    );

    timer.value.intervals.timeline = useHandleTimerTimelineFn(
      timer,
      timerStorage,
      scroll,
      {
        decrease: {
          rate: timerConfig.timelineDecreaseRate,
          interval: timerStorage.value.decreaseIntervalInMilliseconds,
        },
        playFn: options.playTickFn,
      },
    );
    timer.value.intervals.counter = useHandleTimerCounterFn(
      timer,
      timerStorage,
      scroll,
      {
        interval: timerStorage.value.chosenInterval,
        playFn: options.playRingFn,
      },
    );

    timerStorage.value = storageConfig;

    return true;
  }

  timerStorage.value.hiddenAt = new Date(Date.now()).toJSON();

  return true;
};
