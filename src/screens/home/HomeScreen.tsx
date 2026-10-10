import { localDateKey } from "../../notifications/planning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { PLANNER_STORAGE_KEY } from "../../notifications/notificationService";
import { useSelector } from "react-redux";
import { useMedications } from "../../context/MedicationContext";
import type { RootState } from "../../store/store";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router/react-navigation";
import AppSafeView from "../../components/views/AppSafeView";
import HomeHeader from "../../components/headers/HomeHeader";
import { useTutorialAutoStart } from "../../tutorial";
type PlannerSummary = {
  completedVisits: string[];
  appointments: Record<string, { date: string; facility: string }>;
};

const ANC_VISIT_IDS = [
  "anc-1",
  "anc-2",
  "anc-3",
  "anc-4",
  "anc-5",
  "anc-6",
  "anc-7",
  "anc-8",
];
export default function HomeScreen() {
  const { medications, toggleMedicationTaken } = useMedications();
  const navigation = useNavigation<any>();
  const [plannerSummary, setPlannerSummary] =
    useState<PlannerSummary | null>(null);
  useEffect(() => {
    const loadPlannerSummary = async () => {
      try {
        const value = await AsyncStorage.getItem(PLANNER_STORAGE_KEY);
        setPlannerSummary(
          value ? (JSON.parse(value) as PlannerSummary) : null,
        );
      } catch {
        setPlannerSummary(null);
      }
    };

    loadPlannerSummary();

    const unsubscribe = navigation.addListener(
      "focus",
      loadPlannerSummary,
    );

    return unsubscribe;
  }, [navigation]);

  const priorityMedication = medications.find(
    (medication) => !medication.taken,
  );
  const { t } = useTranslation();

  const completedVisits = plannerSummary?.completedVisits ?? [];

  const nextAncVisitId = ANC_VISIT_IDS.find(
    (visitId) => !completedVisits.includes(visitId),
  );

  const nextAncAppointment = nextAncVisitId
    ? plannerSummary?.appointments?.[nextAncVisitId]
    : undefined;
  const nextAncTitle = nextAncVisitId
    ? t(`plannerScreen.contacts.${nextAncVisitId}.title`)
    : "All ANC visits completed";

  const appointmentDate = nextAncAppointment?.date
    ? new Date(nextAncAppointment.date)
    : null;

  const daysUntilAnc =
    appointmentDate && !Number.isNaN(appointmentDate.getTime())
      ? Math.max(
        0,
        Math.ceil(
          (appointmentDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
        ),
      )
      : null;
  const edd = useSelector((state: RootState) => state.dataReducer.edd);
  const userName = useSelector(
    (state: RootState) => state.dataReducer.userName,
  );
  const firstName = userName.trim().split(/\s+/)[0] || "Asha";
  const pregnancyProgress = (() => {
    if (!edd) return null;

    const dueDate = new Date(edd);
    if (Number.isNaN(dueDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.round(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const pregnancyDays = Math.max(0, 280 - daysUntilDue);

    return {
      weeks: Math.floor(pregnancyDays / 7),
      days: pregnancyDays % 7,
    };
  })();
  useTutorialAutoStart();
  const progressPercentage = pregnancyProgress
    ? Math.min(
      ((pregnancyProgress.weeks * 7 + pregnancyProgress.days) / 280) * 100,
      100,
    )
    : 0;
  const trimester = pregnancyProgress
    ? pregnancyProgress.weeks < 14
      ? "FIRST TRIMESTER"
      : pregnancyProgress.weeks < 28
        ? "SECOND TRIMESTER"
        : "THIRD TRIMESTER"
    : t("homeScreen.trimester");
  return (
    <AppSafeView includeBottomInset={false}>
      <HomeHeader />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          {t("homeScreen.greeting", { name: firstName })}
        </Text>
        <Text style={styles.subtitle}>{t("homeScreen.dailyOverview")}</Text>

        <View style={styles.progressCard}>
          <Text style={styles.trimester}>{trimester}</Text>

          <View style={styles.weekRow}>
            <Text style={styles.week}>
              {pregnancyProgress
                ? `${pregnancyProgress.weeks} Weeks`
                : t("homeScreen.weeks")}
            </Text>
            <Text style={styles.days}>
              {pregnancyProgress
                ? `, ${pregnancyProgress.days} Days`
                : t("homeScreen.days")}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercentageText}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        <View style={styles.babyCard}>
          <View style={styles.plumOuter}>
            <View style={styles.leaf} />
            <View style={styles.plum} />
          </View>

          <Text style={styles.babyTitle}>{t("homeScreen.babySize")}</Text>
          <Text style={styles.babyText}>{t("homeScreen.babyLength")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("homeScreen.todaysPriority")}</Text>
        <View style={styles.titleUnderline} />

        <View style={styles.priorityCard}>
          <View style={styles.cardHeading}>
            <Ionicons name="medical" size={18} color="#087D67" />
            <Text style={styles.greenHeading}>{t("homeScreen.medications")}</Text>
          </View>

          {priorityMedication ? (
            <Pressable
              style={styles.medicationRow}
              onPress={() =>
                toggleMedicationTaken(
                  priorityMedication.id,
                  localDateKey(new Date()),
                )
              }
            >
              <View style={styles.checkbox} />

              <View>
                <Text style={styles.itemTitle}>{priorityMedication.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {`${priorityMedication.dosage} · ${priorityMedication.instructions}`}
                </Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.medicationRow}>
              <View style={[styles.checkbox, styles.checkboxSelected]}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>

              <View>
                <Text style={styles.itemTitle}>All medications taken</Text>
                <Text style={styles.itemSubtitle}>
                  You have completed today&apos;s medications.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.cardHeading}>
            <Ionicons name="calendar" size={18} color="#198247" />
            <Text style={styles.greenHeading}>{t("homeScreen.nextAncVisit")}</Text>
          </View>

          <View style={styles.appointmentRow}>
            <View style={styles.appointmentText}>
              <Text style={styles.itemTitle}>{nextAncTitle}</Text>
              <Text style={styles.itemSubtitle}>
                {nextAncAppointment?.facility ?? "Set appointment in Planner"}
              </Text>

            </View>

            <View style={styles.daysBadge}>
              <Text style={styles.daysNumber}>{daysUntilAnc ?? "--"}</Text>
              <Text style={styles.daysLabel}>{t("homeScreen.daysLabel")}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t("homeScreen.quickActions")}</Text>
        <View style={styles.titleUnderline} />

        <View style={styles.quickActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate("Library")}
          >
            <Ionicons name="book" size={32} color="#B62555" />
            <Text style={styles.educationText}>{t("homeScreen.educationLibrary")}</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              Alert.alert(
                t("homeScreen.trackSymptomsAlertTitle"),
                t("homeScreen.trackSymptomsAlertMessage"),
              )
            }
          >
            <Ionicons name="pulse" size={34} color="#087D67" />
            <Text style={styles.symptomText}>{t("homeScreen.trackSymptoms")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppSafeView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F8",
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 25,
    fontWeight: "700",
    color: "#2B2224",
  },
  subtitle: {
    marginTop: 7,
    marginBottom: 20,
    fontSize: 14,
    color: "#66585B",
  },
  progressCard: {
    backgroundColor: "#C64169",
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
  },
  trimester: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 7,
  },
  week: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },
  days: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  progressTrack: {
    height: 9,
    marginTop: 28,
    borderRadius: 10,
    backgroundColor: "#B93660",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  progressPercentageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "right",
  },
  babyCard: {
    alignItems: "center",
    backgroundColor: "#F9E3E5",
    borderRadius: 12,
    paddingVertical: 22,
    marginBottom: 24,
  },
  plumOuter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  plum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#613B60",
  },
  leaf: {
    position: "absolute",
    top: 5,
    width: 9,
    height: 7,
    borderRadius: 6,
    backgroundColor: "#4C965A",
    transform: [{ rotate: "-25deg" }],
    zIndex: 1,
  },
  babyTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "700",
    color: "#2B2224",
  },
  babyText: {
    marginTop: 6,
    fontSize: 13,
    color: "#66585B",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2224",
  },
  titleUnderline: {
    width: 138,
    height: 2,
    marginTop: 7,
    marginBottom: 14,
    backgroundColor: "#F3A4B5",
  },
  priorityCard: {
    backgroundColor: "#FBEAEC",
    borderWidth: 1,
    borderColor: "#F1CDD3",
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  greenHeading: {
    color: "#087D67",
    fontSize: 15,
    fontWeight: "700",
  },
  medicationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7BEC2",
    borderRadius: 7,
    padding: 14,
    marginTop: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#958488",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  checkboxSelected: {
    borderColor: "#087D67",
    backgroundColor: "#087D67",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBCFD4",
    marginVertical: 18,
  },
  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECE8E3",
    borderWidth: 1,
    borderColor: "#D5CEC7",
    borderRadius: 7,
    padding: 12,
    marginTop: 12,
  },
  appointmentText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#30272A",
  },
  itemSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#66585B",
  },
  daysBadge: {
    width: 59,
    height: 58,
    borderRadius: 7,
    backgroundColor: "#277A3E",
    alignItems: "center",
    justifyContent: "center",
  },
  daysNumber: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  daysLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    gap: 14,
  },
  actionButton: {
    flex: 1,
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0BEC4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  educationText: {
    marginTop: 9,
    textAlign: "center",
    color: "#B62555",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  symptomText: {
    marginTop: 9,
    textAlign: "center",
    color: "#087D67",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
});
