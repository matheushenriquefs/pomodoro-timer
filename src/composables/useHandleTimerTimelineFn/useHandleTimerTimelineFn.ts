import { type Ref } from "vue";

import { useResetTimerFn } from "../useResetTimerFn";
import { type TimerStorage, type Timer, type PlayFunction } from "../../types";

/**
 * Handles the timer timeline logic by decreasing the scroll value at a specified rate.
 * @param timer - A reference to the timer object.
 * @param timerStorage - A reference to the timer storage.
 * @param scroll - A reference to the scroll value.
 * @param options - An object containing additional options.
 * @param options.decrease - An object defining the decrease parameters.
 * @param options.decrease.rate - The rate at which the scroll value decreases.
 * @param options.decrease.interval - The interval for the timeline decrease in milliseconds.
 * @param options.playFn - Optional. A function to be executed during the timeline handling.
 * @returns The ID of the interval timer.
 */
export const useHandleTimerTimelineFn = (
  timer: Ref<Timer>,
  timerStorage: Ref<TimerStorage>,
  scroll: Ref<number>,
  options: {
    decrease: {
      rate: number;
      interval: number;
    };
    playFn?: PlayFunction;
  },
) =>
  setInterval(() => {
    scroll.value -= options.decrease.rate;

    if (!scroll.value) {
      useResetTimerFn(timer, timerStorage, scroll);
    }

    if (options.playFn) {
      options.playFn();
    }
  }, options.decrease.interval);
