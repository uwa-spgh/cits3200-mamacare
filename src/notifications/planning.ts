export const ANC_REMINDER_OFFSETS_MS = [
  7 * 24 * 60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  60 * 60 * 1000,
] as const;

export const MEDICATION_HORIZON_DAYS = 30;
export const EDUCATION_WEEKDAY = 7;
export const EDUCATION_HOUR = 10;
export const EDUCATION_MINUTE = 0;

export type MedicationForReminder = {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: string;
  taken: boolean;
  statusDate?: string;
};

export type AppointmentForReminder = {
  id: string;
  title: string;
  date: string;
};

export type MedicationReminderOccurrence = {
  medication: MedicationForReminder;
  date: Date;
};

export const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseMedicationTime = (value: string) => {
  const normalizedValue = value
    .trim()
    .replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
  const nepaliMatch = normalizedValue.match(
    /^(बिहान|दिउँसो|साँझ)\s*(\d{1,2}):(\d{2})$/,
  );
  const match = normalizedValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match && !nepaliMatch) {
    return null;
  }

  let hour = Number(match?.[1] ?? nepaliMatch?.[2]);
  const minute = Number(match?.[2] ?? nepaliMatch?.[3]);
  const period = match
    ? match[3].toUpperCase()
    : nepaliMatch?.[1] === "बिहान"
      ? "AM"
      : "PM";

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  } else if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
};

export const medicationReminderDates = (
  medication: MedicationForReminder,
  now: Date,
  horizonDays = MEDICATION_HORIZON_DAYS,
) => {
  const parsedTime = parseMedicationTime(medication.time);

  if (!parsedTime) {
    return [];
  }

  const dates: Date[] = [];
  const todayKey = localDateKey(now);

  for (let dayOffset = 0; dayOffset < horizonDays; dayOffset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    date.setHours(parsedTime.hour, parsedTime.minute, 0, 0);

    if (date.getTime() <= now.getTime()) {
      continue;
    }

    const isTakenToday =
      dayOffset === 0 &&
      medication.taken &&
      (medication.statusDate === undefined || medication.statusDate === todayKey);

    if (!isTakenToday) {
      dates.push(date);
    }
  }

  return dates;
};

export const medicationReminderOccurrences = (
  medications: MedicationForReminder[],
  now: Date,
  limit: number,
) =>
  medications
    .flatMap((medication) =>
      medicationReminderDates(medication, now).map((date) => ({
        medication,
        date,
      })),
    )
    .sort(
      (left, right) =>
        left.date.getTime() - right.date.getTime() ||
        left.medication.id.localeCompare(right.medication.id),
    )
    .slice(0, Math.max(0, limit));

export const ancReminderDates = (appointmentDate: string, now: Date) => {
  const appointment = new Date(appointmentDate);

  if (Number.isNaN(appointment.getTime())) {
    return [];
  }

  return ANC_REMINDER_OFFSETS_MS.map(
    (offset) => new Date(appointment.getTime() - offset),
  ).filter((date) => date.getTime() > now.getTime());
};
