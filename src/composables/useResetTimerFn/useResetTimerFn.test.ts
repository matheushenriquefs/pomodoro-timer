import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import { useResetTimerFn } from "./useResetTimerFn";
import { storageConfig } from "../../config/storage";
import { type Timer } from "../../types";

describe("useResetTimerFn", () => {
  it("should be defined", () => {
    expect(useResetTimerFn).toBeDefined();
  });

  it("should reset timer data", () => {
    const timer = ref<Timer>({
      isTicking: true,
      hasInteracted: true,
      counter: 60,
      intervals: {
        timeline: 10,
        counter: 11,
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
    const expectedTimerStorage = storageConfig;

    useResetTimerFn(timer, timerStorage, scroll);

    expect(timer.value).toMatchObject(expectedTimer);
    expect(timerStorage.value).toMatchObject(expectedTimerStorage);
    expect(scroll.value).toBe(0);
  });
});
