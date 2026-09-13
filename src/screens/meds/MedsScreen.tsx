import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
import { Medication, useMedications } from "../../context/MedicationContext";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppSafeView from "../../components/views/AppSafeView";

const dates = [
  { day: "Mon", date: "12" },
  { day: "Tue", date: "13" },
  { day: "Wed", date: "14" },
  { day: "Thu", date: "15" },
  { day: "Fri", date: "16" },
];

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  percentage: number,
) => {
  const endAngle = (percentage / 100) * 359.999;

  const start = polarToCartesian(x, y, radius, 0);
  const end = polarToCartesian(x, y, radius, endAngle);

  const largeArcFlag = endAngle > 180 ? 1 : 0;

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
};

export default function MedicationScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState("14");
  const { medications, toggleMedicationTaken } = useMedications();
  const takenCount = medications.filter(
    (medication) => medication.taken,
  ).length;
  const totalCount = medications.length;

  const progressPercent =
    totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);

  const getPeriodIcon = (period: Medication["period"]) => {
    switch (period) {
      case "Morning":
        return "sunny-outline";
      case "Afternoon":
        return "sunny";
      case "Evening":
        return "moon";
    }
  };

  const renderMedicationSection = (
    period: Medication["period"],
    items: Medication[],
  ) => {
    if (items.length === 0) {
      return null;
    }

    return (
     
        <View style={styles.scheduleSection}>
          <View style={styles.periodHeading}>
            <Ionicons name={getPeriodIcon(period)} size={16} color="#6A5058" />

            <Text style={styles.periodTitle}>
              {t(`medicationScreen.${period.toLowerCase()}`)}
            </Text>
          </View>

          {items.map((medication) => (
            <TouchableOpacity
              key={medication.id}
              style={[
                styles.medicationCard,
                medication.missed && styles.overdueMedicationCard,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("MedicationDetails", { id: medication.id })
              }
            >
              <View style={styles.medicationIcon}>
                <Ionicons name="medical" size={18} color="#8B6570" />
              </View>

              <View style={styles.medicationContent}>
                <Text
                  style={[
                    styles.medicationName,
                    medication.taken && styles.takenMedicationName,
                  ]}
                >
                  {medication.name}
                </Text>

                <Text style={styles.medicationDetails}>
                  {medication.dosage} • {medication.instructions}
                </Text>

                {medication.taken ? (
                  <View style={styles.statusRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={13}
                      color="#57A868"
                    />

                    <Text style={styles.takenStatus}>
                      {t("medicationScreen.takenAt", { time: medication.time })}
                    </Text>
                  </View>
                ) : medication.missed ? (
                  <View style={styles.statusRow}>
                    <Ionicons name="time" size={13} color="#F28C28" />

                    <Text style={styles.overdueStatus}>
                      {t("medicationScreen.dueAt", { time: medication.time })}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.upcomingStatus}>
                    {t("medicationScreen.dueAt", { time: medication.time })}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.checkCircle,
                  medication.taken && styles.checkCircleTaken,
                ]}
                onPress={(event) => {
                  event.stopPropagation();
                  toggleMedicationTaken(medication.id);
                }}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {medication.taken && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
    );
  };

  const morningMedications = medications.filter(
    (medication) => medication.period === "Morning",
  );

  const afternoonMedications = medications.filter(
    (medication) => medication.period === "Afternoon",
  );

  const eveningMedications = medications.filter(
    (medication) => medication.period === "Evening",
  );

  return (
    <AppSafeView >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("medsScreen.title")}</Text>

        <View style={styles.dateRow}>
          {dates.map((item) => {
            const selected = selectedDate === item.date;

            return (
              <TouchableOpacity
                key={item.date}
                style={[styles.dateCard, selected && styles.selectedDateCard]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text
                  style={[styles.dateDay, selected && styles.selectedDateText]}
                >
                  {t(`medsScreen.${item.day.toLowerCase()}`)}
                </Text>

                <Text
                  style={[
                    styles.dateNumber,
                    selected && styles.selectedDateText,
                  ]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressTitle}>{t("medsScreen.todaysProgress")}</Text>

            <Text style={styles.progressSubtitle}>
              {t("medsScreen.takenCount", { taken: takenCount, total: totalCount })}
            </Text>
          </View>

          <View style={styles.progressCircleContainer}>
            <Svg width={52} height={52} viewBox="0 0 52 52">
              {/* Uncompleted/background ring */}
              <Circle
                cx={26}
                cy={26}
                r={20}
                stroke="#F4DDE4"
                strokeWidth={3}
                fill="none"
              />

              {/* Completed progress */}
              {progressPercent > 0 && (
                <Path
                  d={describeArc(26, 26, 20, progressPercent)}
                  stroke="#D2265A"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </Svg>

            <View style={styles.progressTextContainer}>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.scheduleTitle}>{t("medsScreen.todaysSchedule")}</Text>

        {renderMedicationSection("Morning", morningMedications)}
        {renderMedicationSection("Afternoon", afternoonMedications)}
        {renderMedicationSection("Evening", eveningMedications)}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            navigation.navigate("AddMedication");
          }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>{t("medsScreen.addNew")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            navigation.navigate("MedicationHistory");
          }}
        >
          <Ionicons name="time-outline" size={18} color="#BE1E50" />

          <Text style={styles.secondaryButtonText}>{t("medsScreen.viewHistory")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppSafeView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8F8",
  },

  container: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BE1E50",
    marginBottom: 16,
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  dateCard: {
    width: 50,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E8C7D0",
    backgroundColor: "#FFF9FA",
    alignItems: "center",
  },

  selectedDateCard: {
    backgroundColor: "#CC285E",
    borderColor: "#CC285E",
  },

  dateDay: {
    fontSize: 11,
    color: "#6B555B",
  },

  dateNumber: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#4A373C",
  },

  selectedDateText: {
    color: "#FFFFFF",
  },

  progressCard: {
    backgroundColor: "#FCECEF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B353B",
  },

  progressSubtitle: {
    fontSize: 12,
    color: "#7A666C",
    marginTop: 5,
  },

  progressCircleContainer: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  progressTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercent: {
    color: "#D2265A",
    fontSize: 12,
    fontWeight: "700",
  },

  scheduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3F3034",
    marginBottom: 12,
  },

  scheduleSection: {
    marginBottom: 14,
  },

  periodHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5,
  },

  periodTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#624A51",
  },

  medicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9FA",
    borderWidth: 1,
    borderColor: "#EDD0D7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  overdueMedicationCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F28C28",
  },

  medicationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FCE7EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  medicationContent: {
    flex: 1,
  },

  medicationName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3E3034",
  },

  takenMedicationName: {
    textDecorationLine: "line-through",
    color: "#7C7376",
  },

  medicationDetails: {
    fontSize: 12,
    color: "#77666B",
    marginTop: 2,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 3,
  },

  takenStatus: {
    fontSize: 11,
    color: "#57A868",
  },

  overdueStatus: {
    fontSize: 11,
    color: "#F28C28",
    fontWeight: "600",
  },

  upcomingStatus: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDBBC4",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  checkCircleTaken: {
    backgroundColor: "#62A96F",
    borderColor: "#62A96F",
  },

  primaryButton: {
    marginTop: 8,
    backgroundColor: "#BE1E50",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E3AEBB",
    borderRadius: 8,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#FFF9FA",
  },

  secondaryButtonText: {
    color: "#BE1E50",
    fontSize: 13,
    fontWeight: "700",
  },
});
