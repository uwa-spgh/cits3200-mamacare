import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useMedications } from "../../context/MedicationContext";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import App from "../../../App";
import AppSafeView from "../../components/views/AppSafeView";

type Period = "Morning" | "Afternoon" | "Evening";

export default function AddMedicationScreen() {
    const { addMedication } = useMedications();
    
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [time, setTime] = useState("");
    const [period, setPeriod] = useState<Period>("Morning");

    const navigation = useNavigation<any>();

    const handleSave = () => {
        addMedication({
            name: name.trim(),
            dosage: dosage.trim(),
            instructions: instructions.trim(),
            time: time.trim(),
            period,
        });

        navigation.navigate("MainAppBottomTabs");
    };

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
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#AE214D" />
                </TouchableOpacity>

                <Text style={styles.title}>Add Medication</Text>
            </View>

            <Text style={styles.label}>Medication or supplement name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Iron & Folic Acid"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Dosage</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 1 pill"
                value={dosage}
                onChangeText={setDosage}
            />

            <Text style={styles.label}>Instructions</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Take with food"
                value={instructions}
                onChangeText={setInstructions}
            />

            <Text style={styles.label}>Time</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 8:00 AM"
                value={time}
                onChangeText={setTime}
            />

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

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    !name.trim() && styles.saveButtonDisabled,
                ]}
                disabled={!name.trim()}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Save Medication</Text>
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

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#AE214D",
        marginLeft: 14,
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

    saveButtonDisabled: {
        opacity: 0.45,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
});