import { type Ref } from "vue";
import { type RemovableRef } from "@vueuse/core";

import { useResetTimerFn } from "../useResetTimerFn";
import { timerConfig } from "../../config/timer";
import { type TimerStorage, type Timer, type PlayFunction } from "../../types";

/**
 * Handles the timer counter logic based on the specified interval.
 * @param timer - A reference to the timer object.
 * @param timerStorage - A reference to the timer storage.
 * @param scroll - A reference to the scroll value.
 * @param options - An object containing additional options.
 * @param options.interval - The interval for the timer counter in minutes.
 * @param options.delay - Optional. The delay in milliseconds before executing the counter logic. Defaults to 1000 milliseconds.
 * @param options.playFn - Optional. A function to be executed when the timer counter reaches its interval.
 * @returns The ID of the interval timer.
 */
export const useHandleTimerCounterFn = (
  timer: Ref<Timer>,
  timerStorage: RemovableRef<TimerStorage>,
  scroll: Ref<number>,
  options: {
    interval: number;
    delay?: number;
    playFn?: PlayFunction;
  },
) =>
  setInterval(() => {
    timer.value.counter++;

    if (
      timer.value.counter ===
      options.interval * timerConfig.oneMinuteInSeconds
    ) {
      useResetTimerFn(timer, timerStorage, scroll);

      if (options.playFn) {
        options.playFn();
      }
    }
  }, options.delay ?? 1000);
