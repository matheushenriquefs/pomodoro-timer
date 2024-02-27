import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import { useHandleTimerCounterFn } from "./useHandleTimerCounterFn";
import { storageConfig } from "../../config/storage";
import { type Timer } from "../../types";

describe("useHandleTimerCounterFn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect(useHandleTimerCounterFn).toBeDefined();
  });

  it("should count until sixty", async () => {
    const timer = ref<Timer>({
      isTicking: true,
      hasInteracted: true,
      counter: 0,
      intervals: {
        timeline: 0,
        counter: 0,
      },
    });
    const scroll = ref(100);
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

    timer.value.intervals.counter = useHandleTimerCounterFn(
      timer,
      timerStorage,
      scroll,
      {
        interval: 1,
        delay: 1,
        playFn,
      },
    );

    vi.advanceTimersByTime(60);

    expect(timer.value).toMatchObject(expectedTimer);
    expect(timerStorage.value).toMatchObject(expectedTimerStorage);
    expect(scroll.value).toBe(0);
    expect(playFn).toHaveBeenCalledOnce();
  });
});
