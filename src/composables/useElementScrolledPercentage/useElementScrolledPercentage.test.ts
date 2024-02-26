import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { computedEager } from "@vueuse/core";

import { useElementScrolledPercentage } from "./useElementScrolledPercentage";

describe("useElementScrolledPercentage", () => {
  it("should be defined", () => {
    expect(useElementScrolledPercentage).toBeDefined();
  });

  it("should return 0 if element is null", () => {
    const element = ref(null);

    const { percentage } = useElementScrolledPercentage(element, 0);

    expect(percentage.value).toBe(0);
  });

  it("it should return the scrolled percentage", () => {
    const mock = vi.fn(
      () =>
        ({
          scrollWidth: 751,
          offsetWidth: 272,
        }) as HTMLElement | null,
    );
    const element = ref(mock());
    const scroll = computedEager(() => 239.5);
    const { percentage } = useElementScrolledPercentage(element, scroll);

    expect(percentage.value).toBe(50);
  });
});
