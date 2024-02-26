export type Timer = {
  isTicking: boolean;
  hasInteracted: boolean;
  counter: number;
  intervals: {
    timeline: number | NodeJS.Timeout;
    counter: number | NodeJS.Timeout;
  };
};

export type TimerStorage = {
  hiddenAt: string;
  chosenInterval: number;
  decreaseIntervalInMilliseconds: number;
};

interface PlayOptions {
  id?: number;
  forceSoundEnabled?: boolean;
  playbackRate?: number;
}

export type PlayFunction = (options?: PlayOptions) => void;
