export const PREGNANCY_LENGTH_DAYS = 280;
const MILLISECONDS_PER_DAY = 86_400_000;

// An EDD is a calendar date, not an instant. Persist YYYY-MM-DD so travelling
// or changing the device timezone does not move the selected due date.
export function parseDueDate(value: string): Date | null {
  const calendar = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (calendar) {
    const [, year, month, day] = calendar.map(Number);
    if (year < 1000 || year > 9999) return null;
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date.getFullYear() === year && date.getMonth() === month - 1 &&
      date.getDate() === day ? date : null;
  }

  // DateInput emits ISO timestamps. Retain the local date selected in its picker.
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  if (!parseDueDate(value.slice(0, 10))) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeDueDate(value: string): string | null {
  const date = parseDueDate(value);
  if (!date) return null;
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function calculateDueDate(value: string, method: "LMP" | "EDD"): string | null {
  const date = parseDueDate(value);
  if (!date) return null;
  if (method === "LMP") date.setDate(date.getDate() + PREGNANCY_LENGTH_DAYS);
  return normalizeDueDate(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  );
}

function calendarDay(date: Date): number {
  // Use calendar components rather than elapsed local hours (DST days can have
  // 23 or 25 hours). UTC here is only a way of numbering calendar days.
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MILLISECONDS_PER_DAY;
}

export function getPregnancyProgress(value: string, today = new Date()) {
  const dueDate = parseDueDate(value);
  if (!dueDate || Number.isNaN(today.getTime())) return null;
  const daysUntilDue = calendarDay(dueDate) - calendarDay(today);
  const pregnancyDays = Math.max(0, PREGNANCY_LENGTH_DAYS - daysUntilDue);
  const weeks = Math.floor(pregnancyDays / 7);
  return {
    dueDate,
    daysUntilDue,
    weeks,
    days: pregnancyDays % 7,
    trimester: weeks < 13 ? 1 : weeks < 28 ? 2 : 3,
    progress: Math.min(pregnancyDays / PREGNANCY_LENGTH_DAYS, 1),
  };
}

export type PregnancyProgress = NonNullable<ReturnType<typeof getPregnancyProgress>>;
