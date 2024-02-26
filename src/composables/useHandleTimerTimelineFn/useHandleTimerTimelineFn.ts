import { type Ref } from "vue";

import { useResetTimerFn } from "../useResetTimerFn";
import { type TimerStorage, type Timer, type PlayFunction } from "../../types";

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
