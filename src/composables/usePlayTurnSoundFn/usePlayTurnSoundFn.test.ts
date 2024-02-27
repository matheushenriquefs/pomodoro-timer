import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { computedEager } from "@vueuse/core";
import { promiseTimeout } from "@vueuse/shared";

import { usePlayTurnSoundFn, delay } from "./usePlayTurnSoundFn";

describe("usePlayTurnSoundFn", () => {
  it("should be defined", () => {
    expect(usePlayTurnSoundFn).toBeDefined();
  });

  it("should play turn sfx when timer is not ticking", async () => {
    let res = await usePlayTurnSoundFn(false);

    expect(res).toBe(true);

    await promiseTimeout(delay);

    res = await usePlayTurnSoundFn(ref(false));

    expect(res).toBe(true);

    await promiseTimeout(delay);

    res = await usePlayTurnSoundFn(computedEager(() => false));

    expect(res).toBe(true);

    await promiseTimeout(delay);

    const playFn = vi.fn();

    res = await usePlayTurnSoundFn(false, playFn);

    expect(playFn).toHaveBeenCalledOnce();

    await promiseTimeout(delay);
  });

  it("should not play turn sfx when timer is ticking", async () => {
    let res = await usePlayTurnSoundFn(true);

    expect(res).toBe(false);

    await promiseTimeout(delay);

    res = await usePlayTurnSoundFn(ref(true));

    expect(res).toBe(false);

    await promiseTimeout(delay);

    res = await usePlayTurnSoundFn(computedEager(() => true));

    expect(res).toBe(false);

    await promiseTimeout(delay);
  });
});
