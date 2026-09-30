import type {
  NotificationPermission,
  PendingReminder,
  ReminderResponse,
  ScheduleRequest,
} from "./types";

export const configureNotificationPlatform = async () => undefined;

export const getNotificationPermission = async (): Promise<NotificationPermission> =>
  "denied";

export const requestNotificationPermission = async (): Promise<NotificationPermission> =>
  "denied";

export const getPendingReminders = async (): Promise<PendingReminder[]> => [];

export const cancelReminder = async (_id: string) => undefined;

export const getLastReminderResponse = (): ReminderResponse | null => null;

export const addReminderResponseListener = (
  _listener: (response: ReminderResponse) => void,
) => () => undefined;

export const clearLastReminderResponse = () => undefined;

export const scheduleReminder = async (_request: ScheduleRequest) => "web-noop";
