import type { ReminderData } from "./types";

export type ReminderDestination =
  | { screen: "medication"; sourceId?: string }
  | { screen: "anc"; sourceId?: string }
  | { screen: "education" };

export const reminderDestination = (
  data: Partial<ReminderData>,
): ReminderDestination | null => {
  if (data.mamaCareReminder !== true) {
    return null;
  }

  if (data.kind === "medication") {
    return { screen: "medication", sourceId: data.sourceId };
  }

  if (data.kind === "anc") {
    return { screen: "anc", sourceId: data.sourceId };
  }

  if (data.kind === "education") {
    return { screen: "education" };
  }

  return null;
};
