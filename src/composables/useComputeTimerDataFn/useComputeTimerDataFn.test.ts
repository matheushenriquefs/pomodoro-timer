import { describe, it, expect } from "vitest";

import { useComputeTimerDataFn } from "./useComputeTimerDataFn";

describe("useComputeTimerDataFn", () => {
  it("should be defined", () => {
    expect(useComputeTimerDataFn).toBeDefined();
  });

  it("should return chosenInterval and decreaseIntervalInMilliseconds", () => {
    const percentage = 38;
    const scroll = 180;

    const res = useComputeTimerDataFn(percentage, scroll);

    expect(res.chosenInterval).toBe(10);
    expect(res.decreaseIntervalInMilliseconds).toBe(1667);
  });
});
