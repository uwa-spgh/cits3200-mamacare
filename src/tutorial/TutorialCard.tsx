import { Ionicons } from "@expo/vector-icons";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../styles/colors";
import { AppFonts } from "../styles/fonts";
import { commonStyles } from "../styles/sharedStyles";
import { ARROW_HEIGHT, ARROW_WIDTH } from "./geometry";
import type { TutorialStep } from "./steps";
import { atLeast, MIN_BODY_FONT_SIZE, MIN_TOUCH_SIZE } from "./theme";
import TutorialIconGlyph from "./TutorialIconGlyph";

interface TutorialCardProps {
  step: TutorialStep;
  index: number;
  total: number;
  arrow: { direction: "up" | "down"; left: number };
  titleRef: Ref<Text>;
  onNext: () => void;
  onSkip: () => void;
}

export default function TutorialCard({
  step,
  index,
  total,
  arrow,
  titleRef,
  onNext,
  onSkip,
}: TutorialCardProps) {
  const { t } = useTranslation();
  const counter = { current: index + 1, total };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {step.headerIcon ? (
          <View style={styles.iconCircle}>
            <TutorialIconGlyph
              icon={step.headerIcon}
              size={s(17)}
              color={AppColors.button_primary_accent}
            />
          </View>
        ) : null}
        <Text accessibilityRole="header" ref={titleRef} style={styles.title}>
          {t(step.titleKey)}
        </Text>
        <Text
          accessibilityLabel={t("tutorial.a11y.counter", counter)}
          style={styles.counter}
        >
          {t("tutorial.counter", counter)}
        </Text>
      </View>

      {step.body.kind === "message" ? (
        <Text style={styles.message}>{t(step.body.messageKey)}</Text>
      ) : (
        <View style={styles.rows}>
          {step.body.rows.map((row) => (
            <View key={row.id} style={styles.row}>
              <View style={styles.rowIconCircle}>
                <TutorialIconGlyph
                  icon={row.icon}
                  size={s(18)}
                  color={AppColors.button_primary_accent}
                />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowLabel}>{t(row.labelKey)}</Text>
                <Text style={styles.rowDescription}>{t(row.descriptionKey)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.dots}
        >
          {Array.from({ length: total }, (_, dotIndex) => (
            <View
              key={dotIndex}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          {step.canSkip ? (
            <Pressable
              accessibilityLabel={t("tutorial.a11y.skip")}
              accessibilityRole="button"
              hitSlop={4}
              onPress={onSkip}
              style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
            >
              <Text style={styles.skipText}>{t("tutorial.buttons.skip")}</Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityLabel={t(step.primaryAccessibilityKey)}
            accessibilityRole="button"
            onPress={onNext}
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
          >
            <Text style={styles.nextText}>{t(step.primaryLabelKey)}</Text>
            <Ionicons
              color={AppColors.white}
              name="arrow-forward"
              size={atLeast(18, 17)}
            />
          </Pressable>
        </View>
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.arrow,
          { left: arrow.left },
          arrow.direction === "down" ? styles.arrowDown : styles.arrowUp,
        ]}
      />
    </View>
  );
}

const BODY_SIZE = atLeast(MIN_BODY_FONT_SIZE, 15);

const styles = StyleSheet.create({
  card: {
    ...commonStyles.shadow,
    backgroundColor: AppColors.white,
    borderRadius: 18,
    paddingHorizontal: s(18),
    paddingVertical: vs(16),
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: AppColors.bg_button_secondary,
    borderRadius: s(20),
    height: s(40),
    justifyContent: "center",
    marginRight: s(12),
    width: s(40),
  },
  title: {
    color: AppColors.text_headings,
    flex: 1,
    fontFamily: AppFonts.Heading1Bold,
    fontSize: atLeast(20, 19),
  },
  counter: {
    color: AppColors.text_headings,
    fontFamily: AppFonts.TextBold,
    fontSize: atLeast(14, 13),
    marginLeft: s(8),
  },
  message: {
    color: AppColors.text_headings,
    fontFamily: AppFonts.TextRegular,
    fontSize: BODY_SIZE,
    lineHeight: Math.round(BODY_SIZE * 1.5),
    marginTop: vs(12),
  },
  rows: {
    gap: vs(12),
    marginTop: vs(12),
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  rowIconCircle: {
    alignItems: "center",
    backgroundColor: AppColors.bg_button_secondary,
    borderRadius: s(18),
    height: s(36),
    justifyContent: "center",
    marginRight: s(12),
    width: s(36),
  },
  rowCopy: {
    flex: 1,
  },
  rowLabel: {
    color: AppColors.text_headings,
    fontFamily: AppFonts.TextBold,
    fontSize: BODY_SIZE,
  },
  rowDescription: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: BODY_SIZE,
    lineHeight: Math.round(BODY_SIZE * 1.4),
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: vs(16),
    rowGap: vs(8),
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: s(5),
    marginRight: s(12),
  },
  dot: {
    backgroundColor: AppColors.stroke_primary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: AppColors.button_primary_accent,
    width: 22,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: s(8),
    marginLeft: "auto",
  },
  skipButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: MIN_TOUCH_SIZE,
    minWidth: MIN_TOUCH_SIZE,
    paddingHorizontal: s(10),
  },
  skipText: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.Heading1Bold,
    fontSize: BODY_SIZE,
  },
  nextButton: {
    alignItems: "center",
    backgroundColor: AppColors.button_primary_accent,
    borderRadius: MIN_TOUCH_SIZE / 2,
    flexDirection: "row",
    gap: s(8),
    justifyContent: "center",
    minHeight: MIN_TOUCH_SIZE,
    paddingHorizontal: s(22),
  },
  nextText: {
    color: AppColors.white,
    fontFamily: AppFonts.Heading1Bold,
    fontSize: atLeast(MIN_BODY_FONT_SIZE, 16),
  },
  pressed: {
    opacity: 0.85,
  },
  arrow: {
    borderLeftColor: "transparent",
    borderLeftWidth: ARROW_WIDTH / 2,
    borderRightColor: "transparent",
    borderRightWidth: ARROW_WIDTH / 2,
    height: 0,
    position: "absolute",
    width: 0,
  },
  arrowDown: {
    borderTopColor: AppColors.white,
    borderTopWidth: ARROW_HEIGHT,
    bottom: -ARROW_HEIGHT,
  },
  arrowUp: {
    borderBottomColor: AppColors.white,
    borderBottomWidth: ARROW_HEIGHT,
    top: -ARROW_HEIGHT,
  },
});
