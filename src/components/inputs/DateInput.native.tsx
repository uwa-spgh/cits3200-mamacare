import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppColors } from "../../styles/colors";
import type { DateInputProps } from "./DateInput.types";

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatDate = (date: Date, mode: DateInputProps["mode"]) =>
  date.toLocaleString(
    undefined,
    mode === "datetime"
      ? {
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          month: "short",
          year: "numeric",
        }
      : {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
  );

export default function DateInput({
  maximumDate,
  minimumDate,
  mode = "date",
  onChange,
  placeholder,
  value,
}: DateInputProps) {
  const { t } = useTranslation();
  const parsedValue = parseDate(value);
  const [draftDate, setDraftDate] = useState(parsedValue ?? new Date());
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  useEffect(() => {
    const nextDate = parseDate(value);
    if (nextDate) {
      setDraftDate(nextDate);
    }
  }, [value]);

  const commitDate = (date: Date) => {
    setDraftDate(date);
    onChange(date.toISOString());
  };

  const openAndroidTimePicker = (date: Date) => {
    DateTimePickerAndroid.open({
      mode: "time",
      onChange: (event, selectedTime) => {
        if (event.type !== "set" || !selectedTime) {
          return;
        }

        const nextDate = new Date(date);
        nextDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
        commitDate(nextDate);
      },
      value: date,
    });
  };

  const openAndroidDatePicker = () => {
    const initialDate = parsedValue ?? new Date();
    setDraftDate(initialDate);

    DateTimePickerAndroid.open({
      maximumDate,
      minimumDate,
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type !== "set" || !selectedDate) {
          return;
        }

        const nextDate = new Date(initialDate);
        nextDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );

        if (mode === "datetime") {
          openAndroidTimePicker(nextDate);
        } else {
          commitDate(nextDate);
        }
      },
      value: initialDate,
    });
  };

  const openPicker = () => {
    const initialDate = parsedValue ?? new Date();
    setDraftDate(initialDate);

    if (Platform.OS === "ios") {
      setIosPickerVisible(true);
    } else {
      openAndroidDatePicker();
    }
  };

  return (
    <>
      <Pressable onPress={openPicker} style={styles.input}>
        <Text style={[styles.inputText, !parsedValue && styles.placeholderText]}>
          {parsedValue ? formatDate(parsedValue, mode) : placeholder}
        </Text>
        <Ionicons color={AppColors.button_primary_accent} name="calendar-outline" size={20} />
      </Pressable>
      {Platform.OS === "ios" ? (
        <Modal
          animationType="fade"
          onRequestClose={() => setIosPickerVisible(false)}
          transparent
          visible={iosPickerVisible}
        >
          <Pressable
            onPress={() => setIosPickerVisible(false)}
            style={styles.modalBackdrop}
          >
            <Pressable
              onPress={(event) => event.stopPropagation()}
              style={styles.modalCard}
            >
              <DateTimePicker
                accentColor={AppColors.button_primary_accent}
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                mode={mode}
                onChange={(_event, date) => date && setDraftDate(date)}
                style={styles.iosPicker}
                textColor={AppColors.text_headings}
                themeVariant="light"
                value={draftDate}
              />
              <Pressable
                onPress={() => {
                  commitDate(draftDate);
                  setIosPickerVisible(false);
                }}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>
                  {t("languageBottomSheet.confirm")}
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    alignItems: "center",
    backgroundColor: AppColors.button_primary_accent,
    borderRadius: 8,
    paddingVertical: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#B98B98",
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  inputText: {
    color: "#33252A",
    flex: 1,
    fontSize: 14,
  },
  iosPicker: {
    height: 216,
    width: "100%",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    maxWidth: 420,
    padding: 18,
    width: "100%",
  },
  placeholderText: {
    color: "#9D858C",
  },
});
