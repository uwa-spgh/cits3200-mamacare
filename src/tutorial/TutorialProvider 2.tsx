import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AccessibilityInfo,
  BackHandler,
  Dimensions,
  InteractionManager,
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import { tutorialGate } from "./gate";
import { spotlightHole } from "./geometry";
import { measureSettled } from "./measure";
import { TUTORIAL_STEPS, type TutorialTargetId } from "./steps";
import { TutorialContext, type TutorialContextValue } from "./TutorialContext";
import TutorialOverlay, { type MeasuredHole } from "./TutorialOverlay";

const waitForTransitions = (isCancelled: () => boolean) =>
  new Promise<void>((resolve) => {

    requestAnimationFrame(() => {
      if (isCancelled()) {
        resolve();
        return;
      }
      InteractionManager.runAfterInteractions(() => resolve());
    });
  });

const useReduceMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
};

export default function TutorialProvider({ children }: { children: ReactNode }) {
  const targets = useRef(new Map<TutorialTargetId, RefObject<View | null>>());
  const overlayRef = useRef<View>(null);
  const reduceMotion = useReduceMotion();

  const [stepIndex, setStepIndexState] = useState<number | null>(null);
  const [measured, setMeasured] = useState<MeasuredHole | null>(null);
  const [closing, setClosing] = useState(false);

  const stepIndexRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const measureToken = useRef(0);

  const setStepIndex = useCallback((index: number | null) => {
    stepIndexRef.current = index;
    setStepIndexState(index);
  }, []);

  const endTour = useCallback((outcome: "complete" | "abort") => {
    if (stepIndexRef.current === null || closingRef.current) return;
    measureToken.current += 1;
    closingRef.current = true;
    if (outcome === "complete") {
      tutorialGate.complete();
    } else {
      tutorialGate.abort();
    }
    setClosing(true);
  }, []);

  const handleClosed = useCallback(() => {
    closingRef.current = false;
    setClosing(false);
    setMeasured(null);
    setStepIndex(null);
  }, [setStepIndex]);

  const measureCurrentStep = useCallback(() => {
    const index = stepIndexRef.current;
    if (index === null || closingRef.current) return;

    const token = measureToken.current + 1;
    measureToken.current = token;
    const step = TUTORIAL_STEPS[index];

    const isCancelled = () => token !== measureToken.current;

    waitForTransitions(isCancelled)
      .then(() =>
        measureSettled({
          getTarget: () => targets.current.get(step.target)?.current ?? null,
          getOverlay: () => overlayRef.current,
          isCancelled,
        }),
      )
      .then((rect) => {
        if (isCancelled()) return;
        if (!rect) {
          endTour("abort");
          return;
        }
        setMeasured({ stepIndex: index, hole: spotlightHole(rect, step.shape) });
      });
  }, [endTour]);

  const next = useCallback(() => {
    const index = stepIndexRef.current;
    if (index === null || closingRef.current) return;
    if (index >= TUTORIAL_STEPS.length - 1) {
      endTour("complete");
    } else {
      setStepIndex(index + 1);
    }
  }, [endTour, setStepIndex]);

  const skip = useCallback(() => endTour("complete"), [endTour]);

  useEffect(() => {
    if (stepIndex !== null) measureCurrentStep();
  }, [stepIndex, measureCurrentStep]);

  const active = stepIndex !== null;

  useEffect(() => {
    if (!active) return;
    const subscriptions = [
      Dimensions.addEventListener("change", measureCurrentStep),
      Keyboard.addListener("keyboardDidShow", measureCurrentStep),
      Keyboard.addListener("keyboardDidHide", measureCurrentStep),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [active, measureCurrentStep]);

  useEffect(() => {
    if (!active) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      skip();
      return true;
    });
    return () => subscription.remove();
  }, [active, skip]);

  const contextValue = useMemo<TutorialContextValue>(
    () => ({
      registerTarget: (id, ref) => {
        targets.current.set(id, ref);
        return () => {
          if (targets.current.get(id) === ref) targets.current.delete(id);
        };
      },
      onTargetLayout: (id) => {
        const index = stepIndexRef.current;
        if (index !== null && TUTORIAL_STEPS[index].target === id) {
          measureCurrentStep();
        }
      },
      onHomeFocus: () => {
        if (stepIndexRef.current !== null) return;
        if (!tutorialGate.tryStart()) return;
        setMeasured(null);
        setStepIndex(0);
      },
      onHomeBlur: () => endTour("abort"),
    }),
    [endTour, measureCurrentStep, setStepIndex],
  );

  return (
    <TutorialContext.Provider value={contextValue}>
      <View
        accessibilityElementsHidden={active}
        importantForAccessibility={active ? "no-hide-descendants" : "auto"}
        style={styles.app}
      >
        {children}
      </View>
      {stepIndex !== null ? (
        <TutorialOverlay
          closing={closing}
          measured={measured}
          onClosed={handleClosed}
          onNext={next}
          onOverlayLayout={measureCurrentStep}
          onSkip={skip}
          overlayRef={overlayRef}
          reduceMotion={reduceMotion}
          stepIndex={stepIndex}
        />
      ) : null}
    </TutorialContext.Provider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
