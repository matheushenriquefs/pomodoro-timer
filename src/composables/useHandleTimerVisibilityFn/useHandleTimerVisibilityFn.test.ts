import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import {
  useHandleTimerVisibilityFn,
  helpers,
} from "./useHandleTimerVisibilityFn";
import { storageConfig } from "../../config/storage";
import { type Timer } from "../../types";

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

describe("useHandleTimerVisibilityFn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect(useHandleTimerVisibilityFn).toBeDefined();
  });

  it("should return false when window is undefined", () => {
    const spy = vi.spyOn(helpers, "isBrowserEnv").mockReturnValueOnce(false);

    const res = useHandleTimerVisibilityFn(timer, timerStorage, scroll, {});

    expect(res).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should return false when the difference in seconds is zero", () => {
    vi.setSystemTime(new Date("2024-02-26T21:58:12.362Z"));
    const timerStorage = useStorage("timer", storageConfig, sessionStorage);
    timerStorage.value.hiddenAt = "2024-02-26T21:58:12.362Z";

    const res = useHandleTimerVisibilityFn(timer, timerStorage, scroll, {});

    expect(res).toBe(false);
  });

  it("should return false when the decrease interval in milliseconds is zero", () => {
    vi.setSystemTime(new Date("2024-02-26T21:59:12.362Z"));
    const timerStorage = useStorage("timer", storageConfig, sessionStorage);
    timerStorage.value.hiddenAt = "2024-02-26T21:58:12.362Z";
    timerStorage.value.decreaseIntervalInMilliseconds = 0;

    const res = useHandleTimerVisibilityFn(timer, timerStorage, scroll, {});

    expect(res).toBe(false);
  });

  it("should return true when document is visible", () => {
    vi.setSystemTime(new Date("2024-02-26T21:59:12.362Z"));
    const timerStorage = useStorage("timer", storageConfig, sessionStorage);
    timerStorage.value.hiddenAt = "2024-02-26T21:58:12.362Z";
    timerStorage.value.decreaseIntervalInMilliseconds = 1;
    const spy = vi.spyOn(window, "clearInterval");
    const spy2 = vi
      .spyOn(helpers, "isDocumentVisible")
      .mockReturnValueOnce(true);
    const expectedTimerStorage = storageConfig;

    const res = useHandleTimerVisibilityFn(timer, timerStorage, scroll, {});

    expect(res).toBe(true);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledOnce();
    expect(timerStorage.value).toMatchObject(expectedTimerStorage);
  });

  it("should return true when document is not visible", () => {
    const date = "2024-02-26T21:59:12.362Z";
    vi.setSystemTime(new Date(date));
    const timerStorage = useStorage("timer", storageConfig, sessionStorage);
    timerStorage.value.decreaseIntervalInMilliseconds = 1;
    const spy = vi
      .spyOn(helpers, "isDocumentVisible")
      .mockReturnValueOnce(false);

    const res = useHandleTimerVisibilityFn(timer, timerStorage, scroll, {});

    expect(res).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
    expect(timerStorage.value.hiddenAt).toBe(date);
  });
});
