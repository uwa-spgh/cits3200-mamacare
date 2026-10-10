// Step config for the first-run spotlight tutorial.

export type TutorialTargetId =
  | "tab.home"
  | "tab.planner"
  | "tab.meds"
  | "tab.library"
  | "header.icons";

export type TutorialIcon =
  | {
      family: "FontAwesome5";
      name: "home" | "calendar-alt" | "pills" | "university";
    }
  | { family: "MaterialCommunityIcons"; name: "account" }
  | { family: "MaterialIcons"; name: "notifications" | "settings" };

export type TutorialPlacement = "above" | "below";

export type TutorialSpotlightShape = "rounded" | "pill";

export interface TutorialRow {
  id: "profile" | "notifications" | "settings";
  icon: TutorialIcon;
  labelKey: string;
  descriptionKey: string;
}

export type TutorialBody =
  | { kind: "message"; messageKey: string }
  | { kind: "rows"; rows: readonly TutorialRow[] };

export interface TutorialStep {
  id: "home" | "planner" | "meds" | "library" | "topIcons";
  target: TutorialTargetId;
  titleKey: string;
  headerIcon: TutorialIcon | null;
  body: TutorialBody;
  placement: TutorialPlacement;
  shape: TutorialSpotlightShape;
  canSkip: boolean;
  primaryLabelKey: string;
  primaryAccessibilityKey: string;
}

const tabStep = (
  id: "home" | "planner" | "meds" | "library",
  target: TutorialTargetId,
  iconName: "home" | "calendar-alt" | "pills" | "university",
): TutorialStep => ({
  id,
  target,
  titleKey: `tutorial.steps.${id}.title`,
  headerIcon: { family: "FontAwesome5", name: iconName },
  body: { kind: "message", messageKey: `tutorial.steps.${id}.message` },
  placement: "above",
  shape: "rounded",
  canSkip: true,
  primaryLabelKey: "tutorial.buttons.next",
  primaryAccessibilityKey: "tutorial.a11y.next",
});

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  tabStep("home", "tab.home", "home"),
  tabStep("planner", "tab.planner", "calendar-alt"),
  tabStep("meds", "tab.meds", "pills"),
  tabStep("library", "tab.library", "university"),
  {
    id: "topIcons",
    target: "header.icons",
    titleKey: "tutorial.steps.topIcons.title",
    headerIcon: null,
    body: {
      kind: "rows",
      rows: [
        {
          id: "profile",
          icon: { family: "MaterialCommunityIcons", name: "account" },
          labelKey: "tutorial.steps.topIcons.profile.label",
          descriptionKey: "tutorial.steps.topIcons.profile.description",
        },
        {
          id: "notifications",
          icon: { family: "MaterialIcons", name: "notifications" },
          labelKey: "tutorial.steps.topIcons.notifications.label",
          descriptionKey: "tutorial.steps.topIcons.notifications.description",
        },
        {
          id: "settings",
          icon: { family: "MaterialIcons", name: "settings" },
          labelKey: "tutorial.steps.topIcons.settings.label",
          descriptionKey: "tutorial.steps.topIcons.settings.description",
        },
      ],
    },
    placement: "below",
    shape: "pill",
    canSkip: false,
    primaryLabelKey: "tutorial.buttons.getStarted",
    primaryAccessibilityKey: "tutorial.a11y.getStarted",
  },
];

export const TUTORIAL_STEP_COUNT = TUTORIAL_STEPS.length;

export const stepTranslationKeys = (step: TutorialStep): string[] => {
  const keys = [step.titleKey, step.primaryLabelKey, step.primaryAccessibilityKey];
  if (step.body.kind === "message") {
    keys.push(step.body.messageKey);
  } else {
    for (const row of step.body.rows) {
      keys.push(row.labelKey, row.descriptionKey);
    }
  }
  return keys;
};
