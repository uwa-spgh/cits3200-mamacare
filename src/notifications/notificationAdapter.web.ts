import type {
  NotificationPermission,
  PendingReminder,
  ScheduleRequest,
} from "./types";

export const configureNotificationPlatform = async () => undefined;

export const getNotificationPermission = async (): Promise<NotificationPermission> =>
  "denied";

export const requestNotificationPermission = async (): Promise<NotificationPermission> =>
  "denied";

export const getPendingReminders = async (): Promise<PendingReminder[]> => [];

export const cancelReminder = async (_id: string) => undefined;

export const scheduleReminder = async (_request: ScheduleRequest) => "web-noop";
