import { useMedicalHistory } from "../../context/MedicalHistoryContext";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { s, vs } from "react-native-size-matters";

import AppText from "../../components/texts/AppText";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import { useTranslation } from "react-i18next";

const commonConditions = [
    { value: "Gestational Diabetes", key: "gestationalDiabetes" },
    { value: "Hypertension", key: "hypertension" },
    { value: "Anaemia", key: "anaemia" },
    { value: "Thyroid Condition", key: "thyroidCondition" },
    { value: "Asthma", key: "asthma" },
];

const commonAllergies = [
    { value: "Penicillin", key: "penicillin" },
    { value: "Aspirin", key: "aspirin" },
    { value: "Latex", key: "latex" },
    { value: "Peanuts", key: "peanuts" },
];

const MedicalHistoryScreen = () => {
    const { t } = useTranslation();
    const {
        medicalHistory,
        saveMedicalHistory,
    } = useMedicalHistory();
    
    const [conditions, setConditions] = useState<string[]>(
        medicalHistory.conditions,
    );

    const [allergies, setAllergies] = useState<string[]>(
        medicalHistory.allergies,
    );

    const [newCondition, setNewCondition] = useState("");
    const [newAllergy, setNewAllergy] = useState("");

    const customConditions = conditions.filter(
        (condition) => !commonConditions.some((item) => item.value === condition),
    );

    const customAllergies = allergies.filter(
        (allergy) => !commonAllergies.some((item) => item.value === allergy),
    );

    const toggleCondition = (condition: string) => {
        setConditions((currentConditions) =>
            currentConditions.includes(condition)
                ? currentConditions.filter(
                    (item) => item !== condition,
                )
                : [...currentConditions, condition],
        );
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies((currentAllergies) =>
            currentAllergies.includes(allergy)
                ? currentAllergies.filter(
                    (item) => item !== allergy,
                )
                : [...currentAllergies, allergy],
        );
    };

    const addCondition = () => {
        const trimmedCondition = newCondition.trim();

        if (!trimmedCondition) {
            return;
        }

        const alreadyExists = conditions.some(
            (condition) =>
                condition.toLowerCase() ===
                trimmedCondition.toLowerCase(),
        );

        if (!alreadyExists) {
            setConditions((currentConditions) => [
                ...currentConditions,
                trimmedCondition,
            ]);
        }

        setNewCondition("");
    };

    const addAllergy = () => {
        const trimmedAllergy = newAllergy.trim();

        if (!trimmedAllergy) {
            return;
        }

        const alreadyExists = allergies.some(
            (allergy) =>
                allergy.toLowerCase() ===
                trimmedAllergy.toLowerCase(),
        );

        if (!alreadyExists) {
            setAllergies((currentAllergies) => [
                ...currentAllergies,
                trimmedAllergy,
            ]);
        }

        setNewAllergy("");
    };

    const handleSave = () => {
        saveMedicalHistory({
            conditions,
            allergies,
        });

        Alert.alert(
            t("medicalHistoryScreen.savedTitle"),
            t("medicalHistoryScreen.savedMessage"),
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <AppText style={styles.heading}>
                    {t("medicalHistoryScreen.title")}
                </AppText>

                <AppText style={styles.sectionTitle}>
                    {t("medicalHistoryScreen.conditionsTitle")}
                </AppText>

                <AppText style={styles.helperText}>
                    {t("medicalHistoryScreen.conditionsHelper")}
                </AppText>

                <View style={styles.chipContainer}>
                    {commonConditions.map(({ value, key }) => {
                        const selected = conditions.includes(value);

                        return (
                            <TouchableOpacity
                                key={value}
                                style={[
                                    styles.chip,
                                    selected && styles.chipSelected,
                                ]}
                                onPress={() => toggleCondition(value)}
                            >
                                <AppText
                                    style={{
                                        ...styles.chipText,
                                        ...(selected ? styles.chipTextSelected : {}),
                                    }}
                                >
                                    {t(`medicalHistoryScreen.conditions.${key}`)}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}

                    {customConditions.map((condition) => (
                        <TouchableOpacity
                            key={condition}
                            style={[
                                styles.chip,
                                styles.chipSelected,
                            ]}
                            onPress={() => toggleCondition(condition)}
                        >
                            <AppText
                                style={{
                                    ...styles.chipText,
                                    ...styles.chipTextSelected,
                                }}
                            >
                                {condition} ×
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.addRow}>
                    <TextInput
                        style={styles.addInput}
                        value={newCondition}
                        onChangeText={setNewCondition}
                        placeholder={t("medicalHistoryScreen.addConditionPlaceholder")}
                    />

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={addCondition}
                    >
                        <AppText style={styles.addButtonText}>
                            {t("medicalHistoryScreen.add")}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <AppText style={styles.sectionTitle}>
                    {t("medicalHistoryScreen.allergiesTitle")}
                </AppText>

                <AppText style={styles.helperText}>
                    {t("medicalHistoryScreen.allergiesHelper")}
                </AppText>

                <View style={styles.chipContainer}>
                    {commonAllergies.map(({ value, key }) => {
                        const selected = allergies.includes(value);

                        return (
                            <TouchableOpacity
                                key={value}
                                style={[
                                    styles.chip,
                                    selected && styles.chipSelected,
                                ]}
                                onPress={() => toggleAllergy(value)}
                            >
                                <AppText
                                    style={{
                                        ...styles.chipText,
                                        ...(selected ? styles.chipTextSelected : {}),
                                    }}
                                >
                                    {t(`medicalHistoryScreen.allergies.${key}`)}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}

                    {customAllergies.map((allergy) => (
                        <TouchableOpacity
                            key={allergy}
                            style={[
                                styles.chip,
                                styles.chipSelected,
                            ]}
                            onPress={() => toggleAllergy(allergy)}
                        >
                            <AppText
                                style={{
                                    ...styles.chipText,
                                    ...styles.chipTextSelected,
                                }}
                            >
                                {allergy} ×
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.addRow}>
                    <TextInput
                        style={styles.addInput}
                        value={newAllergy}
                        onChangeText={setNewAllergy}
                        placeholder={t("medicalHistoryScreen.addAllergyPlaceholder")}
                    />

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={addAllergy}
                    >
                        <AppText style={styles.addButtonText}>
                            {t("medicalHistoryScreen.add")}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <AppText style={styles.saveButtonText}>
                        {t("medicalHistoryScreen.save")}
                    </AppText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default MedicalHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background_primary,
    },

    content: {
        paddingHorizontal: s(20),
        paddingTop: vs(22),
        paddingBottom: vs(30),
    },

    heading: {
        fontFamily: AppFonts.Heading1Bold,
        fontSize: s(20),
        color: AppColors.text_headings,
        marginBottom: vs(22),
    },

    sectionTitle: {
        fontFamily: AppFonts.TextBold,
        fontSize: s(13),
        color: AppColors.text_headings,
        marginBottom: vs(4),
    },

    helperText: {
        fontFamily: AppFonts.TextRegular,
        fontSize: s(11),
        color: AppColors.text_secondary,
        marginBottom: vs(10),
    },

    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: s(8),
        marginBottom: vs(12),
    },

    chip: {
        borderWidth: 1,
        borderColor: AppColors.stroke_primary,
        borderRadius: s(20),
        paddingHorizontal: s(12),
        paddingVertical: vs(7),
        backgroundColor: AppColors.white,
    },

    chipSelected: {
        backgroundColor: AppColors.button_primary_accent,
        borderColor: AppColors.button_primary_accent,
    },

    chipText: {
        fontFamily: AppFonts.TextRegular,
        fontSize: s(11),
        color: AppColors.text_headings,
    },

    chipTextSelected: {
        color: AppColors.white,
    },

    addRow: {
        flexDirection: "row",
        gap: s(8),
        marginBottom: vs(24),
    },

    addInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: AppColors.stroke_primary,
        borderRadius: s(10),
        backgroundColor: AppColors.white,
        paddingHorizontal: s(12),
        paddingVertical: vs(10),
        fontFamily: AppFonts.TextRegular,
        color: AppColors.text_headings,
    },

    addButton: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: s(16),
        borderRadius: s(10),
        backgroundColor: AppColors.button_primary_accent,
    },

    addButtonText: {
        fontFamily: AppFonts.TextBold,
        color: AppColors.white,
        fontSize: s(12),
    },

    saveButton: {
        marginTop: vs(30),
        backgroundColor: AppColors.button_primary_accent,
        borderRadius: s(20),
        paddingVertical: vs(12),
        alignItems: "center",
    },

    saveButtonText: {
        fontFamily: AppFonts.TextBold,
        color: AppColors.white,
        fontSize: s(13),
    },
});