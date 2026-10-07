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
import { SheetManager } from "react-native-actions-sheet";
import { usePersonalInformation } from "../../context/PersonalInformationContext";

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const PersonalInformationScreen = () => {
    const {
        personalInformation,
        savePersonalInformation,
    } = usePersonalInformation();

    const [fullName, setFullName] = useState(
        personalInformation.fullName,
    );

    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        personalInformation.dateOfBirth,
    );

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [height, setHeight] = useState(
        personalInformation.height,
    );

    const [weight, setWeight] = useState(
        personalInformation.weight,
    );

    const [gender, setGender] = useState(
        personalInformation.gender,
    );

    const [phoneNumber, setPhoneNumber] = useState(
        personalInformation.phoneNumber,
    );

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowDatePicker(false);

        if (event.type === "set" && selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    const handleSave = () => {
        if (!fullName.trim()) {
            Alert.alert(
                "Missing information",
                "Please enter your full name."
            );
            return;
        }

        if (!dateOfBirth) {
            Alert.alert(
                "Missing information",
                "Please select your date of birth."
            );
            return;
        }

        const heightNumber = Number(height);

        if (!height || heightNumber < 50 || heightNumber > 250) {
            Alert.alert(
                "Invalid height",
                "Please enter a height between 50 and 250 cm."
            );
            return;
        }

        const weightNumber = Number(weight);

        if (!weight || weightNumber < 20 || weightNumber > 300) {
            Alert.alert(
                "Invalid weight",
                "Please enter a weight between 20 and 300 kg."
            );
            return;
        }

        if (!gender) {
            Alert.alert(
                "Missing information",
                "Please select a gender option."
            );
            return;
        }

        const phoneDigits = phoneNumber.replace(/\D/g, "");

        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            Alert.alert(
                "Invalid phone number",
                "Please enter a valid phone number."
            );
            return;
        }

        savePersonalInformation({
            fullName: fullName.trim(),
            dateOfBirth,
            height,
            weight,
            gender,
            phoneNumber: phoneNumber.trim(),
        });

        Alert.alert(
            "Saved",
            "Your personal information has been saved.",
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <AppText style={styles.heading}>Personal Information</AppText>

                <View style={styles.fieldContainer}>
                    <AppText style={styles.label}>Full Name</AppText>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter full name"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <AppText style={styles.label}>Date of Birth</AppText>

                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <AppText
                            style={{
                                ...styles.genderText,
                                ...(!dateOfBirth ? styles.placeholderText : {}),
                            }}
                        >
                            {dateOfBirth ? formatDate(dateOfBirth) : "Select date of birth"}
                        </AppText>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dateOfBirth ?? new Date(2000, 0, 1)}
                            mode="date"
                            display="spinner"
                            minimumDate={new Date(1900, 0, 1)}
                            maximumDate={new Date()}
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                <View style={styles.row}>
                    <View style={styles.halfField}>
                        <AppText style={styles.label}>Height</AppText>
                        <View style={styles.unitInput}>
                            <TextInput
                                style={styles.inputFlex}
                                value={height}
                                onChangeText={(text) =>
                                    setHeight(text.replace(/[^0-9]/g, ""))
                                }
                                placeholder="170"
                                keyboardType="numeric"
                            />
                            <AppText style={styles.unit}>cm</AppText>
                        </View>
                    </View>

                    <View style={styles.halfField}>
                        <AppText style={styles.label}>Weight</AppText>
                        <View style={styles.unitInput}>
                            <TextInput
                                style={styles.inputFlex}
                                value={weight}
                                onChangeText={(text) =>
                                    setWeight(text.replace(/[^0-9.]/g, ""))
                                }
                                placeholder="65"
                                keyboardType="decimal-pad"
                            />
                            <AppText style={styles.unit}>kg</AppText>
                        </View>
                    </View>
                </View>

                <View style={styles.fieldContainer}>
                    <AppText style={styles.label}>Gender</AppText>

                    <TouchableOpacity
                        style={styles.input}
                        onPress={async () => {

                            const selectedGender = await SheetManager.show("GENDER_SHEET");

                            if (selectedGender) {
                                setGender(selectedGender);
                            }
                        }}
                    >
                        <AppText
                            style={{
                                ...styles.genderText,
                                ...(!gender ? styles.placeholderText : {}),
                            }}
                        >
                            {gender || "Select gender"}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldContainer}>
                    <AppText style={styles.label}>Phone Number</AppText>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={(text) =>
                            setPhoneNumber(text.replace(/[^0-9+\s]/g, ""))
                        }
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <AppText style={styles.saveButtonText}>Save Changes</AppText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PersonalInformationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background_primary,
    },

    content: {
        paddingHorizontal: s(20),
        paddingTop: vs(22),
        paddingBottom: vs(20),
    },

    heading: {
        fontFamily: AppFonts.Heading1Bold,
        fontSize: s(20),
        color: AppColors.text_headings,
        marginBottom: vs(16),
    },

    fieldContainer: {
        marginBottom: vs(16),
    },

    label: {
        fontFamily: AppFonts.TextBold,
        fontSize: s(12),
        color: AppColors.text_headings,
        marginBottom: vs(6),
    },

    input: {
        borderWidth: 1,
        borderColor: AppColors.stroke_primary,
        borderRadius: s(10),
        backgroundColor: AppColors.white,
        paddingHorizontal: s(12),
        paddingVertical: vs(10),
        fontFamily: AppFonts.TextRegular,
        color: AppColors.text_headings,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: vs(16),
    },

    halfField: {
        width: "48%",
    },

    unitInput: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: AppColors.stroke_primary,
        borderRadius: s(10),
        backgroundColor: AppColors.white,
        paddingHorizontal: s(12),
    },

    inputFlex: {
        flex: 1,
        paddingVertical: vs(10),
        fontFamily: AppFonts.TextRegular,
        color: AppColors.text_headings,
    },

    unit: {
        fontFamily: AppFonts.TextRegular,
        color: AppColors.text_secondary,
    },

    saveButton: {
        marginTop: vs(60),
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

    genderText: {
        fontFamily: AppFonts.TextRegular,
        fontSize: s(12),
        color: AppColors.text_headings,
    },

    placeholderText: {
        color: "#8A8A8A",
    },

});