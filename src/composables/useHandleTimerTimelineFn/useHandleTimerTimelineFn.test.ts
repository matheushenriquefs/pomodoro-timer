import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { promiseTimeout } from "@vueuse/shared";

import { useHandleTimerTimelineFn } from "./useHandleTimerTimelineFn";
import { timerConfig } from "../../config/timer";
import { storageConfig } from "../../config/storage";
import { type Timer } from "../../types";

describe("useHandleTimerTimelineFn", () => {
  it("should be defined", () => {
    expect(useHandleTimerTimelineFn).toBeDefined();
  });

  it("should decrease scroll", async () => {
    const timer = ref<Timer>({
      isTicking: true,
      hasInteracted: true,
      counter: 0,
      intervals: {
        timeline: 0,
        counter: 0,
      },
    });
    const scroll = ref(10);
    const timerStorage = useStorage("timer", storageConfig, sessionStorage);
    const expectedTimer = {
      isTicking: false,
      hasInteracted: true,
      counter: 0,
      intervals: {
        timeline: 0,
        counter: 0,
      },
    };
    const delay = 30;
    const playFn = vi.fn(() => undefined);
    const expectedTimerStorage = storageConfig;
    const interval = 1;

    timer.value.intervals.timeline = useHandleTimerTimelineFn(
      timer,
      timerStorage,
      scroll,
      {
        decrease: {
          rate: timerConfig.timelineDecreaseRate,
          interval,
        },
        playFn,
      },
    );

    await promiseTimeout(delay);

    expect(timer.value).toMatchObject(expectedTimer);
    expect(timerStorage.value).toMatchObject(expectedTimerStorage);
    expect(scroll.value).toBe(0);
    expect(playFn).toHaveBeenCalledTimes(20);
  });
});
