import { toValue, type MaybeRefOrGetter } from "vue";
import { useThrottleFn } from "@vueuse/core";

import { type PlayFunction } from "../../types";

export const delay = 125;

/**
 * Throttled function to play a turn sound if not currently ticking.
 * @param _isTicking - A boolean value indicating whether the timer is currently ticking.
 * @param playFn - Optional. A function to be executed to play the turn sound.
 * @returns A boolean indicating whether the turn sound was successfully played.
 */
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
