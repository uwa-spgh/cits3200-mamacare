import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type {
  NotificationPermission,
  PendingReminder,
  ReminderResponse,
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
  if (Platform.OS === "ios" && permission.ios) {
    switch (permission.ios.status) {
      case Notifications.IosAuthorizationStatus.AUTHORIZED:
      case Notifications.IosAuthorizationStatus.PROVISIONAL:
      case Notifications.IosAuthorizationStatus.EPHEMERAL:
        return "granted";
      case Notifications.IosAuthorizationStatus.DENIED:
        return "denied";
      default:
        return "undetermined";
    }
  }

  if (permission.granted) {
    return "granted";
  }

  return permission.status === "denied" ? "denied" : "undetermined";
};

export const getNotificationPermission = async () =>
  normalizePermission(await Notifications.getPermissionsAsync());

export const requestNotificationPermission = async () => {
  await configureNotificationPlatform();
  return normalizePermission(
    await Notifications.requestPermissionsAsync({
      android: {},
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    }),
  );
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

const mapReminderResponse = (
  response: Notifications.NotificationResponse,
): ReminderResponse => ({
  id: response.notification.request.identifier,
  data: response.notification.request.content.data ?? {},
});

export const getLastReminderResponse = (): ReminderResponse | null => {
  const response = Notifications.getLastNotificationResponse();
  return response ? mapReminderResponse(response) : null;
};

export const addReminderResponseListener = (
  listener: (response: ReminderResponse) => void,
) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => listener(mapReminderResponse(response)),
  );

  return () => subscription.remove();
};

export const clearLastReminderResponse = () =>
  Notifications.clearLastNotificationResponse();

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
    throw new Error("A reminder requires a date or weekly schedule.");
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
