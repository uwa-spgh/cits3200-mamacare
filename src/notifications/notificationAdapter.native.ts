import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type {
  NotificationPermission,
  PendingReminder,
  ScheduleRequest,
} from "./types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const configureNotificationPlatform = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Promise.all([
    Notifications.setNotificationChannelAsync("mamacare-important", {
      name: "Appointments and medication",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 150, 250],
    }),
    Notifications.setNotificationChannelAsync("mamacare-education", {
      name: "Pregnancy education",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    }),
  ]);
};

const normalizePermission = (
  permission: Notifications.NotificationPermissionsStatus,
): NotificationPermission => {
  if (permission.granted) {
    return "granted";
  }

  return permission.status === "denied" ? "denied" : "undetermined";
};

export const getNotificationPermission = async () =>
  normalizePermission(await Notifications.getPermissionsAsync());

export const requestNotificationPermission = async () => {
  await configureNotificationPlatform();
  return normalizePermission(await Notifications.requestPermissionsAsync());
};

export const getPendingReminders = async (): Promise<PendingReminder[]> => {
  const requests = await Notifications.getAllScheduledNotificationsAsync();

  return requests
    .filter((request) => request.content.data?.mamaCareReminder === true)
    .map((request) => ({
      id: request.identifier,
      title: request.content.title ?? "MamaCare",
      body: request.content.body ?? "",
      data: request.content.data ?? {},
    }));
};

export const cancelReminder = (id: string) =>
  Notifications.cancelScheduledNotificationAsync(id);

export const scheduleReminder = async (request: ScheduleRequest) => {
  const channelId =
    request.channel === "important"
      ? "mamacare-important"
      : "mamacare-education";

  let trigger: Notifications.NotificationTriggerInput;

  if (request.date) {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: request.date,
      channelId,
    };
  } else if (request.weekly) {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: request.weekly.weekday,
      hour: request.weekly.hour,
      minute: request.weekly.minute,
      channelId,
    };
  } else {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: request.seconds ?? 5,
      channelId,
    };
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: request.title,
      body: request.body,
      data: request.data,
      sound: "default",
    },
    trigger,
  });
};
