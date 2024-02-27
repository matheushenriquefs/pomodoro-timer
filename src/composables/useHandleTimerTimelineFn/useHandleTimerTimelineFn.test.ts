import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import { useHandleTimerTimelineFn } from "./useHandleTimerTimelineFn";
import { timerConfig } from "../../config/timer";
import { storageConfig } from "../../config/storage";
import { type Timer } from "../../types";

describe("useHandleTimerTimelineFn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    vi.advanceTimersByTime(30);

    expect(timer.value).toMatchObject(expectedTimer);
    expect(timerStorage.value).toMatchObject(expectedTimerStorage);
    expect(scroll.value).toBe(0);
    expect(playFn).toHaveBeenCalledTimes(20);
  });
});
