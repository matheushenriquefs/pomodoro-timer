import { computed, toValue, type Ref, type MaybeRefOrGetter } from "vue";

/**
 * Computes the percentage of scrolling within an element.
 * @param element - The element whose scrolling percentage needs to be computed.
 * @param _scroll - The scroll value representing the current position of the scroll.
 * @returns An object containing the computed scrolling percentage.
 */
export const useElementScrolledPercentage = (
  element: Ref<HTMLElement | null>,
  _scroll: number | MaybeRefOrGetter<number>,
) => {
  const percentage = computed(() => {
    if (!element.value) {
      return 0;
    }

    const scroll = toValue(_scroll);

    return Math.round(
      (scroll / (element.value.scrollWidth - element.value.offsetWidth)) * 100,
    );
  });

  return { percentage };
};
