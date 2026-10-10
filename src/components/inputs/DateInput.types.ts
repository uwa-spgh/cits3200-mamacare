export type DateInputMode = "date" | "datetime";

export type DateInputProps = {
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: DateInputMode;
  // A selected date is an ISO string; an empty string means the field was cleared.
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
};
