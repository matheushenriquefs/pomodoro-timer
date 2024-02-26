import { toValue, type MaybeRefOrGetter } from "vue";
import { useThrottleFn } from "@vueuse/core";

import { type PlayFunction } from "../../types";

export const delay = 125;

export const usePlayTurnSoundFn = useThrottleFn(
  (_isTicking: boolean | MaybeRefOrGetter<boolean>, playFn?: PlayFunction) => {
    const isTicking = toValue(_isTicking);

    if (isTicking) {
      return false;
    }

    if (playFn) {
      playFn();
    }

    return true;
  },
  delay,
);
