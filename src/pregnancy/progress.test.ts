import assert from "node:assert/strict";
import { test } from "node:test";
import { createInstance } from "i18next";
import en from "../localization/en.json";
import ne from "../localization/ne.json";
import { calculateDueDate, getPregnancyProgress, normalizeDueDate, parseDueDate } from "./progress";
import { BABY_SIZES, getBabySize } from "./babySizes";
import { formatCountdown, formatDueDate, formatGestation } from "./format";

const today = new Date(2026, 9, 9, 13, 30);

test("October 15 EDD shows 39 weeks 1 day, third trimester, six days remaining", () => {
  const progress = getPregnancyProgress("2026-10-15", today)!;
  assert.equal(progress.weeks, 39);
  assert.equal(progress.days, 1);
  assert.equal(progress.trimester, 3);
  assert.equal(progress.daysUntilDue, 6);
  assert.equal(Math.round(progress.progress * 100), 98);
  assert.equal(getBabySize(progress.weeks)?.comparison, "watermelon");
  assert.equal(getBabySize(progress.weeks)?.lengthCm, 50.7);
});

test("first/second and second/third trimester boundaries follow the weekly guide", () => {
  const atAge = (days: number) => {
    const due = new Date(today);
    due.setDate(due.getDate() + 280 - days);
    return getPregnancyProgress(normalizeDueDate(due.toISOString())!, today)!;
  };
  assert.equal(atAge(12 * 7 + 6).trimester, 1);
  assert.equal(atAge(13 * 7).trimester, 2);
  assert.equal(atAge(27 * 7 + 6).trimester, 2);
  assert.equal(atAge(28 * 7).trimester, 3);
});

test("due today and overdue retain real age while the progress bar stops at 100%", () => {
  const dueToday = getPregnancyProgress("2026-10-09", today)!;
  assert.deepEqual([dueToday.weeks, dueToday.days, dueToday.daysUntilDue, dueToday.progress], [40, 0, 0, 1]);
  const overdue = getPregnancyProgress("2026-10-01", today)!;
  assert.deepEqual([overdue.weeks, overdue.days, overdue.daysUntilDue, overdue.progress], [41, 1, -8, 1]);
});

test("missing/invalid dates never turn into a fabricated pregnancy estimate", () => {
  for (const value of ["", "invalid", "2026-02-30", "2026-13-01", "2026-00-01", "2026-01-00", "0099-01-01", "2026-02-30T00:00:00.000Z"]) {
    assert.equal(getPregnancyProgress(value, today), null, value);
  }
  assert.ok(parseDueDate("2028-02-29"));
  assert.equal(parseDueDate("2026-02-29"), null);
});

test("calendar dates and native picker ISO values keep the selected local day", () => {
  const selected = new Date(2026, 9, 15, 23, 59);
  assert.equal(normalizeDueDate(selected.toISOString()), "2026-10-15");
  assert.equal(normalizeDueDate("2026-10-15"), "2026-10-15");
  assert.equal(parseDueDate("2026-10-15")?.getDate(), 15);
  assert.equal(getPregnancyProgress(selected.toISOString(), today)?.daysUntilDue, 6);
});

test("day arithmetic counts calendar days through DST and leap days", () => {
  assert.equal(getPregnancyProgress("2026-03-09", new Date(2026, 2, 7, 23, 59))?.daysUntilDue, 2);
  assert.equal(getPregnancyProgress("2026-11-02", new Date(2026, 9, 31))?.daysUntilDue, 2);
  assert.equal(getPregnancyProgress("2028-03-01", new Date(2028, 1, 28))?.daysUntilDue, 2);
  assert.equal(calculateDueDate("2026-01-08", "LMP"), "2026-10-15");
  assert.equal(calculateDueDate("2026-10-15", "EDD"), "2026-10-15");
});

test("distant future dates never show negative weeks or progress", () => {
  const progress = getPregnancyProgress("2027-10-09", today)!;
  assert.equal(progress.weeks, 0);
  assert.equal(progress.days, 0);
  assert.equal(progress.progress, 0);
});

test("weekly size guide changes by week and does not extrapolate outside its references", () => {
  assert.equal(BABY_SIZES.length, 37);
  for (let week = 4; week <= 40; week++) {
    const size = getBabySize(week)!;
    assert.ok(size.lengthCm > 0);
    assert.match(size.sourceUrl, new RegExp(`/week-${week}/$`));
    assert.ok(en.pregnancy.comparisons[size.comparison as keyof typeof en.pregnancy.comparisons]);
    assert.ok(ne.pregnancy.comparisons[size.comparison as keyof typeof ne.pregnancy.comparisons]);
  }
  assert.equal(getBabySize(12)?.comparison, "plum");
  assert.equal(getBabySize(13)?.comparison, "peach");
  assert.equal(getBabySize(19)?.measurement, "headToBottom");
  assert.equal(getBabySize(20)?.measurement, "headToHeel");
  assert.equal(getBabySize(3), null);
  assert.equal(getBabySize(41), null);
  assert.equal(getBabySize(Number.NaN), null);
});

test("English and Nepali display the same dates and quantities, including countdown boundaries", async () => {
  const i18n = createInstance();
  await i18n.init({ resources: { en: { translation: en }, ne: { translation: ne } }, lng: "en", fallbackLng: "en" });
  const progress = getPregnancyProgress("2026-10-15", today)!;
  assert.equal(formatGestation(progress, i18n.t, "en"), "39 weeks, 1 day");
  assert.equal(formatCountdown(progress, i18n.t, "en"), "6 days to your estimated due date.");
  assert.equal(formatDueDate(progress, "en"), "Oct 15, 2026");
  assert.equal(formatCountdown(getPregnancyProgress("2026-10-09", today)!, i18n.t, "en"), "Your estimated due date is today.");
  assert.equal(formatCountdown(getPregnancyProgress("2026-10-08", today)!, i18n.t, "en"), "Your estimated due date was 1 day ago.");
  await i18n.changeLanguage("ne");
  assert.equal(formatGestation(progress, i18n.t, "ne"), "३९ हप्ता, १ दिन");
  assert.match(formatCountdown(progress, i18n.t, "ne"), /६/);
  assert.deepEqual(Object.keys(ne.pregnancy).sort(), Object.keys(en.pregnancy).sort());
});
