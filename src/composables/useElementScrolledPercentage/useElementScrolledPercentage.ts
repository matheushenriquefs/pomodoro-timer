import { computed, toValue, type Ref, type MaybeRefOrGetter } from "vue";

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
