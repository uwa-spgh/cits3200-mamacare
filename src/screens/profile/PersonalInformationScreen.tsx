import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
    setPersonalInformation,
    type PersonalInformation,
} from "../../store/reducers/dataReducers";
import type { RootState } from "../../store/store";

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const PersonalInformationScreen = () => {
    const dispatch = useDispatch();
    const personalInformation = useSelector(
        (state: RootState) => state.dataReducer.personalInformation,
    );
    const userName = useSelector(
        (state: RootState) => state.dataReducer.userName,
    );

    const [fullName, setFullName] = useState(
        personalInformation.fullName || userName,
    );

    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        personalInformation.dateOfBirth
            ? new Date(`${personalInformation.dateOfBirth}T00:00:00`)
            : null,
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

    useEffect(() => {
        setFullName(personalInformation.fullName || userName);
        setDateOfBirth(
            personalInformation.dateOfBirth
                ? new Date(`${personalInformation.dateOfBirth}T00:00:00`)
                : null,
        );
        setHeight(personalInformation.height);
        setWeight(personalInformation.weight);
        setGender(personalInformation.gender);
        setPhoneNumber(personalInformation.phoneNumber);
    }, [personalInformation, userName]);

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
        const savedInformation: PersonalInformation = {
            fullName: fullName.trim(),
            dateOfBirth: dateOfBirth
                ? [
                    dateOfBirth.getFullYear(),
                    String(dateOfBirth.getMonth() + 1).padStart(2, "0"),
                    String(dateOfBirth.getDate()).padStart(2, "0"),
                ].join("-")
                : null,
            height,
            weight,
            gender,
            phoneNumber: phoneNumber.trim(),
        };
        dispatch(setPersonalInformation(savedInformation));

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