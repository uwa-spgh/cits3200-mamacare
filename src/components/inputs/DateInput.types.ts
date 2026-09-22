export type DateInputMode = "date" | "datetime";

export type DateInputProps = {
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: DateInputMode;
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
};
