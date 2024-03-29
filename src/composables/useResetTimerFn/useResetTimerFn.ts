import { type Ref } from "vue";
import { type RemovableRef } from "@vueuse/core";

import { storageConfig } from "../../config/storage";
import { type TimerStorage, type Timer } from "../../types";

/**
 * Resets the timer to its initial state.
 * @param timer - A reference to the timer object to reset.
 * @param timerStorage - A reference to the timer storage to reset.
 * @param scroll - A reference to the scroll value to reset.
 */
export const useResetTimerFn = (
  timer: Ref<Timer>,
  timerStorage: RemovableRef<TimerStorage>,
  scroll: Ref<number>,
) => {
  timer.value.isTicking = false;
  timer.value.counter = 0;
  scroll.value = 0;
  clearInterval(timer.value.intervals.timeline);
  clearInterval(timer.value.intervals.counter);
  timer.value.intervals.timeline = 0;
  timer.value.intervals.counter = 0;
  timerStorage.value = storageConfig;
};
