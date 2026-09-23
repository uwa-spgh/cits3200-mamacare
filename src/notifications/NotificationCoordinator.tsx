import { useEffect } from "react";
import { AppState } from "react-native";
import i18n from "../localization/i18n";
import {
  initializeNotifications,
  syncAllNotifications,
} from "./notificationService";

export default function NotificationCoordinator() {
  useEffect(() => {
    initializeNotifications().catch(() => undefined);

    const languageListener = () => {
      syncAllNotifications().catch(() => undefined);
    };
    i18n.on("languageChanged", languageListener);

    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        syncAllNotifications().catch(() => undefined);
      }
    });

    return () => {
      i18n.off("languageChanged", languageListener);
      appStateListener.remove();
    };
  }, []);

  return null;
}
