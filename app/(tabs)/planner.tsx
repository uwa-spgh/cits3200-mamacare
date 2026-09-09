import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Visit = {
  id: string;
  title: string;
  timing: string;
  trimester: string;
  date: string;
  summary: string;
  advice: string[];
  checks: string[];
  dangerSigns: string[];
};

type PlannerState = {
  selectedVisitId: string;
  completedVisits: string[];
  checklist: Record<string, string[]>;
  notes: Record<string, string>;
  appointments: Record<string, { date: string; facility: string }>;
};

const BRAND = "#BC1F58";
const BRAND_DARK = "#8D1942";
const GREEN = "#098F48";
const MINT = "#86EBD8";
const CREAM = "#FFF8F8";
const PINK = "#FBE4EA";
const BORDER = "#E9B8C4";
const TEXT = "#33252A";
const STORAGE_KEY = "mamacare:planner";

const visits: Visit[] = [
  {
    id: "anc-1",
    title: "1st ANC Visit",
    timing: "Up to 12 weeks",
    trimester: "First trimester",
    date: "Before week 12",
    summary: "Start antenatal care early and register your pregnancy.",
    advice: [
      "Enter LMP and confirm your expected date of delivery.",
      "Start daily iron-folic acid tablets as advised.",
      "Eat balanced local foods such as rice, dal, leafy greens, eggs, fish, and fruits.",
      "Plan your delivery facility, transport, and emergency contact person.",
    ],
    checks: [
      "Bring your ANC card or health record",
      "Blood pressure check",
      "Weight and height measurement",
      "Urine test for protein",
      "Haemoglobin or anaemia check",
      "Blood grouping and blood sugar check",
    ],
    dangerSigns: [
      "Bleeding",
      "Severe abdominal pain",
      "Severe headache",
      "Blurred vision",
      "High fever",
    ],
  },
  {
    id: "anc-2",
    title: "2nd ANC Visit",
    timing: "20 weeks",
    trimester: "Second trimester",
    date: "Week 20",
    summary: "Continue supplements and check your baby growth.",
    advice: [
      "Continue iron-folic acid and other supplements.",
      "Ask whether your Td vaccine dose is due.",
      "Tell your health worker about swelling, headache, or bleeding.",
    ],
    checks: [
      "Bring your health card",
      "Prepare questions for the midwife",
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Urine test for protein",
    ],
    dangerSigns: [
      "Severe headache",
      "Blurred vision",
      "Swelling of face or hands",
      "Any bleeding",
    ],
  },
  {
    id: "anc-3",
    title: "3rd ANC Visit",
    timing: "26 weeks",
    trimester: "Second trimester",
    date: "Week 26",
    summary: "Prepare for the third trimester and start birth preparedness.",
    advice: [
      "Continue iron-folic acid tablets.",
      "Check in on your mental wellbeing.",
      "Decide the place of delivery.",
      "Arrange transport and save emergency contact numbers.",
      "Prepare a delivery bag and essential newborn items.",
    ],
    checks: [
      "Bring your health card",
      "Review your birth plan",
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Discuss delivery facility and transport",
    ],
    dangerSigns: [
      "Severe abdominal pain",
      "Reduced fetal movement",
      "Any bleeding",
    ],
  },
  {
    id: "anc-4",
    title: "4th ANC Visit",
    timing: "30 weeks",
    trimester: "Third trimester",
    date: "Week 30",
    summary: "Confirm delivery preparation and skilled birth attendance.",
    advice: [
      "Confirm your chosen delivery facility.",
      "Talk about skilled birth attendance.",
      "Start preparing for breastfeeding.",
      "Share key information with family or a support person.",
    ],
    checks: [
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Review breastfeeding preparation",
      "Confirm delivery facility",
    ],
    dangerSigns: [
      "Bleeding",
      "Watery discharge or fluid leakage",
      "Reduced fetal movement",
    ],
  },
  {
    id: "anc-5",
    title: "5th ANC Visit",
    timing: "34 weeks",
    trimester: "Third trimester",
    date: "Week 34",
    summary: "Learn labour signs and prepare newborn care items.",
    advice: [
      "Learn signs that labour is starting.",
      "Prepare your delivery bag.",
      "Plan to keep the baby warm with skin-to-skin contact.",
      "Plan early and exclusive breastfeeding.",
    ],
    checks: [
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Review labour warning signs",
      "Check delivery bag items",
    ],
    dangerSigns: [
      "Contractions before 37 weeks",
      "Reduced fetal movement",
      "Bleeding",
      "Severe headache or swelling",
    ],
  },
  {
    id: "anc-6",
    title: "6th ANC Visit",
    timing: "36 weeks",
    trimester: "Third trimester",
    date: "Week 36",
    summary: "Do the final birth preparation and emergency plan review.",
    advice: [
      "Review your emergency plan.",
      "Confirm your transport plan.",
      "Save facility and family contact numbers.",
      "Ask about family planning information.",
    ],
    checks: [
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Confirm transport plan",
      "Save emergency contacts",
    ],
    dangerSigns: [
      "Bleeding",
      "Watery discharge or fluid leakage",
      "Reduced fetal movement",
      "Abnormal position confirmed at visit",
    ],
  },
  {
    id: "anc-7",
    title: "7th ANC Visit",
    timing: "38 weeks",
    trimester: "Third trimester",
    date: "Week 38",
    summary: "Prepare to go to the facility when labour signs begin.",
    advice: [
      "Know when labour starts.",
      "Go to your chosen facility as soon as labour signs begin.",
      "Ask when emergency care is needed.",
      "Keep your ready-for-delivery items together.",
    ],
    checks: [
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Confirm ready-for-delivery plan",
      "Review emergency care signs",
    ],
    dangerSigns: [
      "Signs labour is starting",
      "Reduced or no fetal movement",
      "Bleeding",
      "Severe abdominal pain",
    ],
  },
  {
    id: "anc-8",
    title: "8th ANC Visit",
    timing: "40 weeks",
    trimester: "Third trimester",
    date: "Week 40",
    summary: "Visit the facility for assessment if labour has not started.",
    advice: [
      "Ask what to do if labour has not started.",
      "Prepare for routine assessment after 40 weeks.",
      "Learn how the app will move from ANC to postnatal care after birth registration.",
    ],
    checks: [
      "Blood pressure check",
      "Weight measurement",
      "Fundal height check",
      "Fetal heartbeat check",
      "Discuss post-term assessment",
      "Ask about postnatal care schedule",
    ],
    dangerSigns: [
      "No labour by 41 weeks",
      "Reduced or no fetal movement",
      "Bleeding",
      "Signs labour is starting",
    ],
  },
];

const defaultState: PlannerState = {
  selectedVisitId: "anc-2",
  completedVisits: ["anc-1"],
  checklist: {},
  notes: {},
  appointments: {
    "anc-2": {
      date: "Tuesday, Oct 24 - 10:00 AM",
      facility: "City General Hospital, Ward C",
    },
  },
};

export default function PlannerScreen() {
  const [view, setView] = useState<"schedule" | "checklist">("schedule");
  const [state, setState] = useState(defaultState);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const selectedVisit = useMemo(
    () => visits.find((visit) => visit.id === state.selectedVisitId) ?? visits[0],
    [state.selectedVisitId],
  );
  const selectedChecks = state.checklist[selectedVisit.id] ?? [];
  const selectedAppointment = state.appointments[selectedVisit.id] ?? {
    date: selectedVisit.date,
    facility: "Local health facility",
  };

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value && isMounted) {
          setState({ ...defaultState, ...(JSON.parse(value) as PlannerState) });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) {
          setHasLoadedState(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedState) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hasLoadedState, state]);

  const updateState = (nextState: PlannerState) => {
    setState(nextState);
  };

  const selectVisit = (visitId: string) => {
    updateState({ ...state, selectedVisitId: visitId });
  };

  const toggleCheck = (item: string) => {
    const current = state.checklist[selectedVisit.id] ?? [];
    const next = current.includes(item)
      ? current.filter((check) => check !== item)
      : [...current, item];

    updateState({
      ...state,
      checklist: { ...state.checklist, [selectedVisit.id]: next },
    });
  };

  const toggleVisitComplete = () => {
    const isComplete = state.completedVisits.includes(selectedVisit.id);
    const completedVisits = isComplete
      ? state.completedVisits.filter((visitId) => visitId !== selectedVisit.id)
      : [...state.completedVisits, selectedVisit.id];

    updateState({ ...state, completedVisits });
  };

  const updateAppointment = (field: "date" | "facility", value: string) => {
    updateState({
      ...state,
      appointments: {
        ...state.appointments,
        [selectedVisit.id]: {
          ...selectedAppointment,
          [field]: value,
        },
      },
    });
  };

  const updateNotes = (value: string) => {
    updateState({
      ...state,
      notes: { ...state.notes, [selectedVisit.id]: value },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {view === "schedule" ? (
        <AppointmentTracker
          appointment={selectedAppointment}
          completedVisits={state.completedVisits}
          onBook={() => setView("checklist")}
          onSelectVisit={selectVisit}
          selectedVisitId={selectedVisit.id}
          visits={visits}
        />
      ) : (
        <VisitChecklist
          checkedItems={selectedChecks}
          notes={state.notes[selectedVisit.id] ?? ""}
          onBack={() => setView("schedule")}
          onCompleteVisit={toggleVisitComplete}
          onToggleCheck={toggleCheck}
          onUpdateAppointment={updateAppointment}
          onUpdateNotes={updateNotes}
          visit={selectedVisit}
          appointment={selectedAppointment}
          visitComplete={state.completedVisits.includes(selectedVisit.id)}
        />
      )}
    </SafeAreaView>
  );
}

function AppointmentTracker({
  appointment,
  completedVisits,
  onBook,
  onSelectVisit,
  selectedVisitId,
  visits,
}: {
  appointment: { date: string; facility: string };
  completedVisits: string[];
  onBook: () => void;
  onSelectVisit: (visitId: string) => void;
  selectedVisitId: string;
  visits: Visit[];
}) {
  const selectedVisit = visits.find((visit) => visit.id === selectedVisitId) ?? visits[0];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Appointments</Text>
      <View style={styles.nextCard}>
        <View>
          <Text style={styles.nextLabel}>Next Appointment</Text>
          <Text style={styles.nextTitle}>{selectedVisit.title}</Text>
        </View>
        <View style={styles.calendarBadge}>
          <Ionicons name="calendar" color="#FFFFFF" size={24} />
        </View>
        <View style={styles.nextDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" color="#FFFFFF" size={18} />
            <Text style={styles.nextDetailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" color="#FFFFFF" size={18} />
            <Text style={styles.nextDetailText}>{appointment.facility}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Visit Schedule</Text>
      <View style={styles.timeline}>
        {visits.map((visit, index) => (
          <VisitCard
            completed={completedVisits.includes(visit.id)}
            key={visit.id}
            last={index === visits.length - 1}
            onPress={() => onSelectVisit(visit.id)}
            selected={visit.id === selectedVisitId}
            visit={visit}
          />
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={onBook}>
        <Ionicons name="add-circle-outline" color="#FFFFFF" size={18} />
        <Text style={styles.primaryButtonText}>Prepare for Appointment</Text>
      </Pressable>
    </ScrollView>
  );
}

function VisitCard({
  completed,
  last,
  onPress,
  selected,
  visit,
}: {
  completed: boolean;
  last: boolean;
  onPress: () => void;
  selected: boolean;
  visit: Visit;
}) {
  return (
    <Pressable onPress={onPress} style={styles.visitRow}>
      <View style={styles.timelineRail}>
        <View
          style={[
            styles.timelineDot,
            completed && styles.timelineDotDone,
            selected && styles.timelineDotSelected,
          ]}
        >
          {completed ? <Ionicons name="checkmark" color="#FFFFFF" size={13} /> : null}
        </View>
        {!last && <View style={styles.timelineLine} />}
      </View>
      <View
        style={[
          styles.visitCard,
          completed && styles.visitCardDone,
          selected && styles.visitCardSelected,
        ]}
      >
        <View style={styles.visitHeader}>
          <Text style={styles.visitTitle}>{visit.title}</Text>
          <Text
            style={[
              styles.statusPill,
              completed ? styles.statusDone : selected ? styles.statusUpcoming : styles.statusLater,
            ]}
          >
            {completed ? "Completed" : selected ? "Upcoming" : visit.trimester}
          </Text>
        </View>
        <Text style={styles.visitTiming}>{visit.timing}</Text>
        <Text style={[styles.visitDate, selected && styles.visitDateSelected]}>
          {visit.date}
        </Text>
      </View>
    </Pressable>
  );
}

function VisitChecklist({
  appointment,
  checkedItems,
  notes,
  onBack,
  onCompleteVisit,
  onToggleCheck,
  onUpdateAppointment,
  onUpdateNotes,
  visit,
  visitComplete,
}: {
  appointment: { date: string; facility: string };
  checkedItems: string[];
  notes: string;
  onBack: () => void;
  onCompleteVisit: () => void;
  onToggleCheck: (item: string) => void;
  onUpdateAppointment: (field: "date" | "facility", value: string) => void;
  onUpdateNotes: (value: string) => void;
  visit: Visit;
  visitComplete: boolean;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.backInline}>
        <Ionicons name="arrow-back" color="#5F414A" size={20} />
        <Text style={styles.backInlineText}>Planner</Text>
      </Pressable>
      <Text style={styles.checklistTitle}>Visit Checklist</Text>
      <View style={styles.visitChip}>
        <Ionicons name="calendar" color="#156A5E" size={15} />
        <Text style={styles.visitChipText}>
          {visit.title} - {visit.timing}
        </Text>
      </View>
      <Text style={styles.description}>{visit.summary}</Text>

      <View style={styles.editCard}>
        <Text style={styles.inputLabel}>Appointment date and time</Text>
        <TextInput
          onChangeText={(value) => onUpdateAppointment("date", value)}
          style={styles.input}
          value={appointment.date}
        />
        <Text style={styles.inputLabel}>Facility or provider</Text>
        <TextInput
          onChangeText={(value) => onUpdateAppointment("facility", value)}
          style={styles.input}
          value={appointment.facility}
        />
      </View>

      <ChecklistSection
        color={GREEN}
        icon="file-tray-full"
        items={visit.checks}
        onToggle={onToggleCheck}
        selectedItems={checkedItems}
        title="Before and During Your Visit"
      />
      <InfoSection
        color={BRAND}
        icon="heart-circle"
        items={visit.advice}
        title="Health Advice"
      />
      <InfoSection
        color="#D94370"
        icon="warning"
        items={visit.dangerSigns}
        title="Danger Signs"
      />
      <View style={styles.panel}>
        <View style={styles.panelHeading}>
          <View style={[styles.panelIcon, { backgroundColor: "#F4DDE4" }]}>
            <Ionicons name="create-outline" color={BRAND_DARK} size={21} />
          </View>
          <Text style={styles.panelTitle}>Notes for Provider</Text>
        </View>
        <TextInput
          multiline
          onChangeText={onUpdateNotes}
          placeholder="E.g., Ask about safe sleeping positions, mention headaches..."
          placeholderTextColor="#9D858C"
          style={styles.notesInput}
          textAlignVertical="top"
          value={notes}
        />
      </View>
      <Pressable style={styles.primaryButton} onPress={onCompleteVisit}>
        <Ionicons
          name={visitComplete ? "checkmark-done-circle" : "checkmark-circle"}
          color="#FFFFFF"
          size={18}
        />
        <Text style={styles.primaryButtonText}>
          {visitComplete ? "Visit Completed" : "Complete Visit"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function ChecklistSection({
  color,
  icon,
  items,
  onToggle,
  selectedItems,
  title,
}: {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
  onToggle: (item: string) => void;
  selectedItems: string[];
  title: string;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeading}>
        <View style={[styles.panelIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} color="#FFFFFF" size={20} />
        </View>
        <Text style={styles.panelTitle}>{title}</Text>
      </View>
      {items.map((item) => (
        <Pressable key={item} onPress={() => onToggle(item)} style={styles.checkRow}>
          <View
            style={[
              styles.checkbox,
              selectedItems.includes(item) && styles.checkboxSelected,
            ]}
          >
            {selectedItems.includes(item) ? (
              <Ionicons name="checkmark" color="#FFFFFF" size={17} />
            ) : null}
          </View>
          <Text style={styles.checkText}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function InfoSection({
  color,
  icon,
  items,
  title,
}: {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
  title: string;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeading}>
        <View style={[styles.panelIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} color="#FFFFFF" size={20} />
        </View>
        <Text style={styles.panelTitle}>{title}</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: color }]} />
          <Text style={styles.checkText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CREAM,
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 32,
  },
  pageTitle: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },
  nextCard: {
    backgroundColor: "#D63F73",
    borderRadius: 12,
    marginBottom: 24,
    padding: 22,
  },
  nextLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  nextTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 8,
  },
  calendarBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.24)",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: 22,
    top: 24,
    width: 56,
  },
  nextDetails: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    gap: 13,
    marginTop: 18,
    padding: 15,
  },
  detailRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  nextDetailText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 14,
  },
  timeline: {
    marginBottom: 24,
  },
  visitRow: {
    flexDirection: "row",
    minHeight: 116,
  },
  timelineRail: {
    alignItems: "center",
    width: 44,
  },
  timelineDot: {
    alignItems: "center",
    backgroundColor: "#F3D8DF",
    borderColor: "#F3D8DF",
    borderRadius: 12,
    borderWidth: 3,
    height: 24,
    justifyContent: "center",
    marginTop: 4,
    width: 24,
  },
  timelineDotDone: {
    backgroundColor: "#2D8B43",
    borderColor: "#2D8B43",
  },
  timelineDotSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: BRAND,
  },
  timelineLine: {
    backgroundColor: "#EEC9D2",
    flex: 1,
    width: 2,
  },
  visitCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EED1D8",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginBottom: 16,
    padding: 18,
  },
  visitCardDone: {
    backgroundColor: PINK,
  },
  visitCardSelected: {
    borderColor: BRAND,
    borderWidth: 2,
  },
  visitHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  visitTitle: {
    color: TEXT,
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
  },
  statusPill: {
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusDone: {
    backgroundColor: "#CFE8D1",
    color: "#2E833D",
  },
  statusUpcoming: {
    backgroundColor: "#FCD6E1",
    color: BRAND,
  },
  statusLater: {
    backgroundColor: "#F5E8EC",
    color: "#856874",
  },
  visitTiming: {
    color: "#79666D",
    fontSize: 15,
    marginTop: 14,
  },
  visitDate: {
    color: "#79666D",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 10,
  },
  visitDateSelected: {
    color: BRAND,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: BRAND,
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 4,
    paddingVertical: 17,
    shadowColor: "#70203C",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  backInline: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  backInlineText: {
    color: "#5F414A",
    fontSize: 15,
    fontWeight: "700",
  },
  checklistTitle: {
    color: BRAND,
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "900",
  },
  visitChip: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: MINT,
    borderRadius: 7,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  visitChipText: {
    color: "#145D55",
    fontSize: 13,
    fontWeight: "900",
  },
  description: {
    color: "#604E55",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
    marginTop: 14,
  },
  editCard: {
    backgroundColor: PINK,
    borderColor: BORDER,
    borderRadius: 9,
    borderWidth: 1,
    gap: 8,
    marginBottom: 18,
    padding: 14,
  },
  inputLabel: {
    color: "#6A515A",
    fontSize: 12,
    fontWeight: "900",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#B98B98",
    borderRadius: 7,
    borderWidth: 1,
    color: TEXT,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  panel: {
    backgroundColor: "#FFF1F3",
    borderColor: BORDER,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  panelHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  panelIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  panelTitle: {
    color: TEXT,
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 21,
    fontWeight: "900",
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12,
  },
  checkbox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#9B7F87",
    borderRadius: 3,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  checkboxSelected: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  checkText: {
    color: TEXT,
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 16,
    lineHeight: 24,
  },
  bulletRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },
  bullet: {
    borderRadius: 5,
    height: 9,
    marginTop: 8,
    width: 9,
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#8C6973",
    borderRadius: 7,
    borderWidth: 2,
    color: TEXT,
    fontSize: 15,
    minHeight: 112,
    padding: 14,
  },
});
