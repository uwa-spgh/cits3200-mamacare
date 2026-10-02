import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  cardWidthFor,
  layoutCard,
  SCREEN_MARGIN,
  type Hole,
  type Size,
} from "./geometry";
import Spotlight from "./Spotlight";
import { TUTORIAL_STEPS } from "./steps";
import { TUTORIAL_DIM, TUTORIAL_FADE_MS } from "./theme";
import TutorialCard from "./TutorialCard";

export interface MeasuredHole {
  stepIndex: number;
  hole: Hole;
}

interface TutorialOverlayProps {
  overlayRef: RefObject<View | null>;
  stepIndex: number;
  measured: MeasuredHole | null;
  closing: boolean;
  reduceMotion: boolean;
  onOverlayLayout: () => void;
  onNext: () => void;
  onSkip: () => void;
  onClosed: () => void;
}

const fade = (
  value: Animated.Value,
  toValue: number,
  reduceMotion: boolean,
  onDone?: () => void,
) => {
  if (reduceMotion) {
    value.setValue(toValue);
    onDone?.();
    return;
  }
  Animated.timing(value, {
    duration: TUTORIAL_FADE_MS,
    toValue,
    useNativeDriver: Platform.OS !== "web",
  }).start(() => onDone?.());
};

export default function TutorialOverlay({
  overlayRef,
  stepIndex,
  measured,
  closing,
  reduceMotion,
  onOverlayLayout,
  onNext,
  onSkip,
  onClosed,
}: TutorialOverlayProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const titleRef = useRef<Text>(null);
  const [screen, setScreen] = useState<Size | null>(null);
  const [cardHeight, setCardHeight] = useState<{ stepIndex: number; height: number } | null>(
    null,
  );
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useMemo(() => new Animated.Value(0), [stepIndex]);

  const step = TUTORIAL_STEPS[stepIndex];
  const hole = measured?.hole ?? null;
  const ready =
    screen !== null &&
    measured?.stepIndex === stepIndex &&
    cardHeight?.stepIndex === stepIndex;
  const readyStep = ready ? stepIndex : null;

  useEffect(() => {
    if (readyStep === null) return;
    fade(overlayOpacity, 1, reduceMotion);
    fade(cardOpacity, 1, reduceMotion);

    const title = titleRef.current;
    if (title) AccessibilityInfo.sendAccessibilityEvent(title, "focus");
    AccessibilityInfo.announceForAccessibilityWithOptions(
      t("tutorial.a11y.stepAnnouncement", {
        current: readyStep + 1,
        total: TUTORIAL_STEPS.length,
        title: t(TUTORIAL_STEPS[readyStep].titleKey),
      }),
      { queue: true },
    );
  }, [readyStep, cardOpacity, overlayOpacity, reduceMotion, t]);

  useEffect(() => {
    if (closing) fade(overlayOpacity, 0, reduceMotion, onClosed);
  }, [closing, overlayOpacity, reduceMotion, onClosed]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setScreen({ width, height });
    onOverlayLayout();
  };

  const cardWidth = screen ? cardWidthFor(screen.width) : 0;
  const cardLayout =
    screen && hole && cardHeight?.stepIndex === stepIndex
      ? layoutCard({
          screen,
          hole,
          card: { width: cardWidth, height: cardHeight.height },
          placement: step.placement,
          safeTop: insets.top,
          safeBottom: insets.bottom,
        })
      : null;

  return (
    <View
      accessibilityViewIsModal
      collapsable={false}
      onLayout={handleLayout}
      onStartShouldSetResponder={() => true}
      ref={overlayRef}
      style={StyleSheet.absoluteFill}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        {screen && hole ? (
          <Spotlight screen={screen} hole={hole} />
        ) : (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim]} />
        )}

        {screen ? (
          <Animated.View
            key={stepIndex}
            onLayout={(event) =>
              setCardHeight({ stepIndex, height: event.nativeEvent.layout.height })
            }
            pointerEvents={ready && !closing ? "box-none" : "none"}
            style={[
              styles.cardSlot,
              {
                left: cardLayout?.left ?? SCREEN_MARGIN,
                opacity: ready ? cardOpacity : 0,
                top: cardLayout?.top ?? 0,
                width: cardWidth,
              },
            ]}
          >
            <TutorialCard
              arrow={{
                direction: step.placement === "above" ? "down" : "up",
                left: cardLayout?.arrowLeft ?? 0,
              }}
              index={stepIndex}
              onNext={onNext}
              onSkip={onSkip}
              step={step}
              titleRef={titleRef}
              total={TUTORIAL_STEPS.length}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSlot: {
    position: "absolute",
  },
  dim: {
    backgroundColor: TUTORIAL_DIM,
  },
});
