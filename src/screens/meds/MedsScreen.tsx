import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react"; 
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
import { Medication, useMedications } from "../../context/MedicationContext";
import { localDateKey } from "../../notifications/planning";
import { toIntlLocale } from "../../localization/localeMap";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppSafeView from "../../components/views/AppSafeView";
import HomeHeader from "../../components/headers/HomeHeader";

const getPreviousFourteenDays = (locale: string) => {
  const dates = [];
  const today = new Date();

  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    dates.push({
      key: localDateKey(date),
      day: date.toLocaleDateString(locale, {
        weekday: "short",
      }),
      date: date.toLocaleDateString(locale, {
        day: "numeric",
      }),
      fullDate: date,
    });
  }

  return dates;
};

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
  const { t, i18n } = useTranslation();

  const locale = toIntlLocale(i18n.language);
  const numberFormat = new Intl.NumberFormat(locale);
  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const dates = getPreviousFourteenDays(locale);

  const [selectedDate, setSelectedDate] = useState(
    localDateKey(new Date()),
  );

  const dateScrollRef = useRef<ScrollView>(null);

  const {
    medications,
    adherenceHistory,
    toggleMedicationTaken,
  } = useMedications();

  const visibleMedications = medications.filter(
    (medication) => medication.createdDate <= selectedDate
  );

  const selectedDateRecords = adherenceHistory.filter(
    (record) => record.date === selectedDate,
  );

  const getMedicationStatusForDate = (medicationId: string) => {
    const record = adherenceHistory.find(
      (item) =>
        item.medicationId === medicationId &&
        item.date === selectedDate,
    );

    return record?.status ?? null;
  };

  const takenCount = selectedDateRecords.filter(
    (record) =>
      record.status === "taken" &&
      visibleMedications.some(
        (medication) => medication.id === record.medicationId
      )
  ).length;

  const totalCount = visibleMedications.length;

  const progressPercent =
    totalCount === 0
      ? 0
      : Math.round((takenCount / totalCount) * 100);

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

  const todayKey = localDateKey(new Date());

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = localDateKey(yesterday);

  const isTodaySelected = selectedDate === todayKey;
  const isYesterdaySelected = selectedDate === yesterdayKey;

  const selectedDateLabel = dates.find(
    (item) => item.key === selectedDate,
  )?.fullDate;

  const progressTitle = isTodaySelected
    ? t("medsScreen.todaysProgress")
    : isYesterdaySelected
      ? t("medsScreen.yesterdaysProgress")
      : selectedDateLabel
        ? t("medsScreen.progressForDate", { date: selectedDateLabel.toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
        }) })
        : t("medsScreen.progress");

  const scheduleTitle = isTodaySelected
    ? t("medsScreen.todaysSchedule")
    : isYesterdaySelected
      ? t("medsScreen.yesterdaysSchedule")
      : selectedDateLabel
        ? t("medsScreen.scheduleForDate", { date: selectedDateLabel.toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
        }) })
        : t("medsScreen.schedule");

  const isSelectedDateEditable =
    selectedDate === todayKey ||
    selectedDate === yesterdayKey;

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

        {items.map((medication) => {
          const status = getMedicationStatusForDate(medication.id);

          const isTaken = status === "taken";
          const isMissed = status === "missed";

          return (
            <View
              key={medication.id}
              style={[
                styles.medicationCard,
                isMissed && styles.overdueMedicationCard,
              ]}
            >
              <TouchableOpacity
                style={styles.medicationDetailsButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t("medicationScreen.medicationAccessibility", {
                  name: medication.name,
                  dosage: medication.dosage,
                  instructions: medication.instructions,
                  time: medication.time,
                })}
                onPress={() => navigation.navigate("MedicationDetails", { id: medication.id })}
              >
                <View style={styles.medicationIcon}>
                  <Ionicons name="medical" size={18} color="#8B6570" />
                </View>

                <View style={styles.medicationContent}>
                  <Text
                    style={[
                      styles.medicationName,
                      isTaken && styles.takenMedicationName,
                    ]}
                  >
                    {medication.name}
                  </Text>

                  <Text style={styles.medicationDetails}>
                    {medication.dosage} • {medication.instructions}
                  </Text>

                  {isTaken ? (
                    <View style={styles.statusRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color="#57A868"
                      />

                      <Text style={styles.takenStatus}>
                        {t("medicationScreen.takenAt", {
                          time: medication.time,
                        })}
                      </Text>
                    </View>
                  ) : isMissed ? (
                    <View style={styles.statusRow}>
                      <Ionicons name="time" size={13} color="#F28C28" />

                      <Text style={styles.overdueStatus}>
                        {t("medicationScreen.dueAt", {
                          time: medication.time,
                        })}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.upcomingStatus}>
                      {t("medicationScreen.dueAt", {
                        time: medication.time,
                      })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                accessible
                accessibilityRole="checkbox"
                accessibilityLabel={t("medicationScreen.medicationToggleAccessibility", {
                  name: medication.name,
                  time: medication.time,
                })}
                accessibilityState={{ checked: isTaken, disabled: !isSelectedDateEditable }}
                aria-checked={isTaken}
                aria-disabled={!isSelectedDateEditable}
                disabled={!isSelectedDateEditable}
                style={[
                  styles.checkCircle,
                  isTaken && styles.checkCircleTaken,
                  !isSelectedDateEditable && styles.checkCircleDisabled,
                ]}
                onPress={(event) => {
                  event.stopPropagation();

                  if (isSelectedDateEditable) {
                    toggleMedicationTaken(
                      medication.id,
                      selectedDate,
                    );
                  }
                }}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {isTaken && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
        </View>
    );
  };

  const morningMedications = visibleMedications.filter(
    (medication) => medication.period === "Morning"
  );

  const afternoonMedications = visibleMedications.filter(
    (medication) => medication.period === "Afternoon"
  );

  const eveningMedications = visibleMedications.filter(
    (medication) => medication.period === "Evening"
  );

  return (
    <AppSafeView includeBottomInset={false}>
      <HomeHeader />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("medsScreen.title")}</Text>

        <ScrollView
          ref={dateScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
          onContentSizeChange={() => {
            dateScrollRef.current?.scrollToEnd({
              animated: false,
            });
          }}
        >
          {dates.map((item) => {
            const selected = selectedDate === item.key;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.dateCard,
                  selected && styles.selectedDateCard,
                ]}
                onPress={() => setSelectedDate(item.key)}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selected && styles.selectedDateText,
                  ]}
                >
                  {item.day}
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
        </ScrollView>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressTitle}>
              {progressTitle}
            </Text>

            <Text style={styles.progressSubtitle}>
              {t("medsScreen.takenCount", {
                taken: numberFormat.format(takenCount),
                total: numberFormat.format(totalCount),
              })}
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
              <Text style={styles.progressPercent}>
                {percentFormat.format(progressPercent / 100)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.scheduleTitle}>
          {scheduleTitle}
        </Text>

        {visibleMedications.length === 0 ? (
          <View style={styles.emptyMedicationContainer}>
            <Ionicons
              name="medical-outline"
              size={36}
              color="#C78A9D"
            />

            <Text style={styles.emptyMedicationTitle}>
              {t(
                isTodaySelected
                  ? "medsScreen.emptyTodayTitle"
                  : "medsScreen.emptyDateTitle",
              )}
            </Text>

            <Text style={styles.emptyMedicationText}>
              {t(
                isTodaySelected
                  ? "medsScreen.emptyTodayDescription"
                  : "medsScreen.emptyDateDescription",
              )}
            </Text>
          </View>
        ) : (
          <>
            {renderMedicationSection("Morning", morningMedications)}
            {renderMedicationSection("Afternoon", afternoonMedications)}
            {renderMedicationSection("Evening", eveningMedications)}
          </>
        )}

        {isTodaySelected && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              navigation.navigate("AddMedication");
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              {t("medsScreen.addNew")}
            </Text>
          </TouchableOpacity>
        )}

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
    gap: 10,
    paddingRight: 4,
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

  medicationDetailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  checkCircleDisabled: {
    opacity: 0.5,
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

  emptyMedicationContainer: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },

  emptyMedicationTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#4A373C",
  },

  emptyMedicationText: {
    marginTop: 6,
    fontSize: 12,
    color: "#78666C",
    textAlign: "center",
    lineHeight: 18,
  },
});
