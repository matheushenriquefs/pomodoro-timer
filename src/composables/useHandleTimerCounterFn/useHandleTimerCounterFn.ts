import { type Ref } from "vue";
import { type RemovableRef } from "@vueuse/core";

import { useResetTimerFn } from "../useResetTimerFn";
import { timerConfig } from "../../config/timer";
import { type TimerStorage, type Timer, type PlayFunction } from "../../types";

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
