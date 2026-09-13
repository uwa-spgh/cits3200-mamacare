import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Period, useMedications } from "../../context/MedicationContext";
import AppSafeView from "../../components/views/AppSafeView";

type DetailsRoute = {
  key: string;
  name: string;
  params?: { id?: string };
};

export default function MedicationDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailsRoute>();
  const id = route.params?.id;

  const { medications, updateMedication, removeMedication } = useMedications();

  const medication = medications.find((item) => item.id === id);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState<Period>("Morning");

  useEffect(() => {
    if (!medication) {
      return;
    }

    setName(medication.name);
    setDosage(medication.dosage);
    setInstructions(medication.instructions);
    setTime(medication.time);
    setPeriod(medication.period);
  }, [medication]);

  const handleSave = () => {
    if (!medication) {
      return;
    }

    updateMedication(medication.id, {
      name: name.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      time: time.trim(),
      period,
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!medication) {
      return;
    }

    removeMedication(medication.id);
    navigation.goBack();
  };

  if (!medication) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Medication not found.</Text>

        <TouchableOpacity
          style={styles.backToMedicationButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToMedicationText}>Back to Medications</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AppSafeView>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{
              top: 15,
              bottom: 15,
              left: 15,
              right: 15,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#AE214D" />
          </TouchableOpacity>

          <Text style={styles.title}>Medication Details</Text>
        </View>

        <Text style={styles.label}>Medication or supplement name</Text>

        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Dosage</Text>

        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
        />

        <Text style={styles.label}>Instructions</Text>

        <TextInput
          style={styles.input}
          value={instructions}
          onChangeText={setInstructions}
        />

        <Text style={styles.label}>Time</Text>

        <TextInput style={styles.input} value={time} onChangeText={setTime} />

        <Text style={styles.label}>Time of day</Text>

        <View style={styles.periodRow}>
          {(["Morning", "Afternoon", "Evening"] as Period[]).map((item) => {
            const selected = period === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.periodButton,
                  selected && styles.periodButtonSelected,
                ]}
                onPress={() => setPeriod(item)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selected && styles.periodButtonTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#B42318" />

          <Text style={styles.deleteButtonText}>Delete Medication</Text>
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
    padding: 20,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#AE214D",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A373C",
    marginBottom: 7,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E3C3CB",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#3E3034",
  },

  periodRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  periodButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E3C3CB",
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#FFF9FA",
  },

  periodButtonSelected: {
    backgroundColor: "#CC285E",
    borderColor: "#CC285E",
  },

  periodButtonText: {
    fontSize: 12,
    color: "#6B555B",
    fontWeight: "600",
  },

  periodButtonTextSelected: {
    color: "#FFFFFF",
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#BE1E50",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  deleteButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F1B7B3",
    borderRadius: 8,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFF7F6",
  },

  deleteButtonText: {
    color: "#B42318",
    fontSize: 13,
    fontWeight: "700",
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: "#FFF8F8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  notFoundText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  backToMedicationButton: {
    backgroundColor: "#BE1E50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  backToMedicationText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
