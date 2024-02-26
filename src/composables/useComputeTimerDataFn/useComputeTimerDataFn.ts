import { toValue, type MaybeRefOrGetter } from "vue";

import { timerConfig } from "../../config/timer";

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
