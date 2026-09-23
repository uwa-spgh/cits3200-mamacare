export const ANC_REMINDER_OFFSETS_MS = [
  7 * 24 * 60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  60 * 60 * 1000,
] as const;

export const MEDICATION_HORIZON_DAYS = 30;
export const EDUCATION_WEEKDAY = 7;
export const EDUCATION_HOUR = 10;
export const EDUCATION_MINUTE = 0;
export const TEST_NOTIFICATION_DELAY_SECONDS = 5;

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

export const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseMedicationTime = (value: string) => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

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

export const ancReminderDates = (appointmentDate: string, now: Date) => {
  const appointment = new Date(appointmentDate);

  if (Number.isNaN(appointment.getTime())) {
    return [];
  }

  return ANC_REMINDER_OFFSETS_MS.map(
    (offset) => new Date(appointment.getTime() - offset),
  ).filter((date) => date.getTime() > now.getTime());
};

