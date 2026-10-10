import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { s, vs } from "react-native-size-matters";

import AppText from "../texts/AppText";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import { useTranslation } from "react-i18next";

const genderOptions = [
    "Female",
    "Male",
    "Non-binary",
    "Other",
    "Prefer not to say",
];

const GenderBottomSheet = () => {
    const { t } = useTranslation();
    const handleSelect = (value: string) => {
        SheetManager.hide("GENDER_SHEET", {
            payload: value,
        });
    };

    return (
        <ActionSheet id="GENDER_SHEET">
            <View style={styles.container}>
                <AppText style={styles.heading}>
                    {t("genderBottomSheet.title")}
                </AppText>

                {genderOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={styles.option}
                        onPress={() => handleSelect(option)}
                    >
                        <AppText style={styles.optionText}>
                            {t(`genderBottomSheet.options.${option.toLowerCase().replace(/[^a-z]+/g, "")}`)}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </ActionSheet>
    );
};

export default GenderBottomSheet;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: s(20),
        paddingTop: vs(15),
        paddingBottom: vs(25),
    },

    heading: {
        fontFamily: AppFonts.TextBold,
        fontSize: s(16),
        color: AppColors.text_headings,
        marginBottom: vs(12),
    },

    option: {
        paddingVertical: vs(12),
        borderBottomWidth: 1,
        borderBottomColor: AppColors.stroke_primary,
    },

    optionText: {
        fontFamily: AppFonts.TextRegular,
        fontSize: s(14),
        color: AppColors.text_headings,
    },
});