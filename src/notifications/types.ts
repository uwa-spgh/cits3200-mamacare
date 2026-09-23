export type ReminderKind = "anc" | "medication" | "education" | "test";

export type ReminderData = {
  mamaCareReminder: true;
  kind: ReminderKind;
  sourceId?: string;
  occurrenceDate?: string;
  scheduledFor?: string;
  scheduleLabel?: string;
};

export type ScheduleRequest = {
  title: string;
  body: string;
  data: ReminderData;
  channel: "important" | "education";
  date?: Date;
  weekly?: {
    weekday: number;
    hour: number;
    minute: number;
  };
  seconds?: number;
};

export type PendingReminder = {
  id: string;
  title: string;
  body: string;
  data: Partial<ReminderData>;
};

export type NotificationPermission = "granted" | "denied" | "undetermined";

