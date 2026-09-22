import { createElement, type CSSProperties } from "react";
import type { DateInputProps } from "./DateInput.types";

const pad = (value: number) => value.toString().padStart(2, "0");

const toInputValue = (value: string | undefined, mode: DateInputProps["mode"]) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return mode === "datetime"
    ? `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    : datePart;
};

const toDateLimit = (value?: Date) =>
  value
    ? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
    : undefined;

export default function DateInput({
  maximumDate,
  minimumDate,
  mode = "date",
  onChange,
  placeholder,
  value,
}: DateInputProps) {
  const style: CSSProperties = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #B98B98",
    borderRadius: 7,
    boxSizing: "border-box",
    color: "#33252A",
    fontFamily: "inherit",
    fontSize: 14,
    minHeight: 44,
    padding: "10px 12px",
    width: "100%",
  };

  return createElement("input", {
    "aria-label": placeholder,
    max: toDateLimit(maximumDate),
    min: toDateLimit(minimumDate),
    onChange: (event: { currentTarget: { value: string } }) => {
      const nextDate = new Date(
        mode === "datetime" ? event.currentTarget.value : `${event.currentTarget.value}T00:00:00`,
      );

      if (!Number.isNaN(nextDate.getTime())) {
        onChange(nextDate.toISOString());
      }
    },
    style,
    type: mode === "datetime" ? "datetime-local" : "date",
    value: toInputValue(value, mode),
  });
}
