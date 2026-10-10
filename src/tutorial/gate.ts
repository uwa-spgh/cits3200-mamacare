// Decides when the tutorial runs. It follows onboarding rather than a "seen" flag:
// every completed onboarding pass makes the tour pending, the next time Home gains
// focus it starts, and finishing or skipping clears it.
//
// State lives in memory. Completing onboarding or choosing Settings replay marks
// the tour pending. Returning users with a saved EDD bypass onboarding, so a
// process restart alone does not mark the tour pending.

type Listener = () => void;

export interface TutorialGate {
  isPending: () => boolean;
  isRunning: () => boolean;
  markOnboardingComplete: () => void;
  markPending: () => void;
  tryStart: () => boolean;
  complete: () => void;
  abort: () => void;
  subscribe: (listener: Listener) => () => void;
}

export const createTutorialGate = (): TutorialGate => {
  let pending = false;
  let running = false;
  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const markPending = () => {
    pending = true;
    notify();
  };

  return {
    isPending: () => pending,
    isRunning: () => running,
    markOnboardingComplete: markPending,
    markPending,
    tryStart: () => {
      if (!pending || running) return false;
      running = true;
      notify();
      return true;
    },
    complete: () => {
      pending = false;
      running = false;
      notify();
    },
    abort: () => {
      running = false;
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export const tutorialGate = createTutorialGate();

export const markOnboardingComplete = () => tutorialGate.markOnboardingComplete();

export const resetTutorial = () => tutorialGate.markPending();
