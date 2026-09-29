import type {
  NavigationContainerRefWithCurrent,
  ParamListBase,
} from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import i18n from "../localization/i18n";
import {
  addReminderResponseListener,
  clearLastReminderResponse,
  getLastReminderResponse,
} from "./notificationAdapter";
import {
  initializeNotifications,
  syncAllNotifications,
} from "./notificationService";
import { reminderDestination } from "./routing";
import type { ReminderResponse } from "./types";

type NotificationCoordinatorProps = {
  navigationReady: boolean;
  navigationRef: NavigationContainerRefWithCurrent<ParamListBase>;
};

export default function NotificationCoordinator({
  navigationReady,
  navigationRef,
}: NotificationCoordinatorProps) {
  const [response, setResponse] = useState<ReminderResponse | null>(() =>
    getLastReminderResponse(),
  );

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

  useEffect(
    () => addReminderResponseListener(setResponse),
    [],
  );

  useEffect(() => {
    if (!navigationReady || !navigationRef.isReady() || !response) {
      return;
    }

    const destination = reminderDestination(response.data);
    if (!destination) {
      setResponse(null);
      return;
    }

    const navigation = navigationRef as NavigationContainerRefWithCurrent<any>;
    const hasMainApp = navigation
      .getRootState()
      .routes.some((route) => route.name === "MainAppBottomTabs");
    const openMainApp = (params: Record<string, unknown>) => {
      if (hasMainApp) {
        navigation.navigate("MainAppBottomTabs", params);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainAppBottomTabs", params }],
        });
      }
    };

    if (destination.screen === "medication") {
      if (destination.sourceId) {
        if (hasMainApp) {
          navigation.navigate("MedicationDetails", {
            id: destination.sourceId,
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {
                name: "MainAppBottomTabs",
                params: { screen: "Meds" },
              },
              {
                name: "MedicationDetails",
                params: { id: destination.sourceId },
              },
            ],
          });
        }
      } else {
        openMainApp({ screen: "Meds" });
      }
    } else if (destination.screen === "anc") {
      openMainApp({
        screen: "Planner",
        params: destination.sourceId
          ? {
              initial: false,
              params: { visitId: destination.sourceId },
              screen: "VisitChecklist",
            }
          : undefined,
      });
    } else {
      openMainApp({ screen: "Library" });
    }

    clearLastReminderResponse();
    setResponse(null);
  }, [navigationReady, navigationRef, response]);

  return null;
}
