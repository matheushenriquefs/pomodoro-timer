import { toValue, type MaybeRefOrGetter } from "vue";

import { timerConfig } from "../../config/timer";

/**
 * Computes timer data based on percentage and scroll values.
 * @param _percentage - The percentage value representing the position in the timeline.
 * @param _scroll - The scroll value representing the user's scroll position.
 * @returns An object containing the computed timer data.
 */
export const useComputeTimerDataFn = (
  _percentage: number | MaybeRefOrGetter<number>,
  _scroll: number | MaybeRefOrGetter<number>,
) => {
  const percentage = toValue(_percentage);
  const scroll = toValue(_scroll);

  const chosenInterval = Math.round(
    (timerConfig.quantityOfTimelineMarks *
      timerConfig.quantityOfMinutesBetweenMarks *
      percentage) /
      100,
  );

  const decreaseIntervalInMilliseconds = Math.round(
    ((chosenInterval * timerConfig.oneMinuteInSeconds) /
      (scroll / timerConfig.timelineDecreaseRate)) *
      1000,
  );

  return {
    chosenInterval,
    decreaseIntervalInMilliseconds,
  };
};
