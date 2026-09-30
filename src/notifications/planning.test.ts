/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import {
  ANC_REMINDER_OFFSETS_MS,
  ancReminderDates,
  localDateKey,
  medicationReminderDates,
  medicationReminderOccurrences,
  parseMedicationTime,
} from "./planning";

test("parses 12-hour medication times", () => {
  assert.deepEqual(parseMedicationTime("8:05 AM"), { hour: 8, minute: 5 });
  assert.deepEqual(parseMedicationTime("12:30 AM"), { hour: 0, minute: 30 });
  assert.deepEqual(parseMedicationTime("12:30 PM"), { hour: 12, minute: 30 });
  assert.deepEqual(parseMedicationTime("9:15 PM"), { hour: 21, minute: 15 });
  assert.deepEqual(parseMedicationTime("बिहान ८:०५"), { hour: 8, minute: 5 });
  assert.deepEqual(parseMedicationTime("साँझ ९:१५"), { hour: 21, minute: 15 });
  assert.equal(parseMedicationTime("25:00"), null);
});

test("prepares 30 medication occurrences when today's dose is still due", () => {
  const now = new Date(2026, 8, 23, 8, 0, 0);
  const dates = medicationReminderDates(
    {
      id: "med-1",
      name: "Iron",
      dosage: "1 tablet",
      instructions: "With food",
      time: "9:00 AM",
      taken: false,
      statusDate: localDateKey(now),
    },
    now,
  );

  assert.equal(dates.length, 30);
  assert.equal(dates[0].getHours(), 9);
  assert.equal(dates[29].getDate(), new Date(2026, 9, 22, 9).getDate());
});

test("taking a medication cancels today but preserves future days", () => {
  const now = new Date(2026, 8, 23, 8, 0, 0);
  const dates = medicationReminderDates(
    {
      id: "med-1",
      name: "Iron",
      dosage: "1 tablet",
      instructions: "With food",
      time: "9:00 AM",
      taken: true,
      statusDate: localDateKey(now),
    },
    now,
  );

  assert.equal(dates.length, 29);
  assert.equal(localDateKey(dates[0]), "2026-09-24");
});

test("limits medication reminders to the nearest occurrences across medications", () => {
  const now = new Date(2026, 8, 23, 8, 0, 0);
  const occurrences = medicationReminderOccurrences(
    [
      {
        id: "morning",
        name: "Iron",
        dosage: "",
        instructions: "",
        time: "9:00 AM",
        taken: false,
      },
      {
        id: "afternoon",
        name: "Calcium",
        dosage: "",
        instructions: "",
        time: "1:00 PM",
        taken: false,
      },
    ],
    now,
    3,
  );

  assert.equal(occurrences.length, 3);
  assert.deepEqual(
    occurrences.map(({ medication }) => medication.id),
    ["morning", "afternoon", "morning"],
  );
  assert.ok(
    occurrences.every(
      (occurrence, index) =>
        index === 0 ||
        occurrence.date.getTime() >= occurrences[index - 1].date.getTime(),
    ),
  );
});

test("creates ANC reminders exactly 7 days, 24 hours and 1 hour before", () => {
  const appointment = new Date(2026, 9, 30, 10, 0, 0);
  const now = new Date(2026, 8, 1, 0, 0, 0);
  const reminders = ancReminderDates(appointment.toISOString(), now);

  assert.equal(reminders.length, 3);
  reminders.forEach((reminder, index) => {
    assert.equal(
      appointment.getTime() - reminder.getTime(),
      ANC_REMINDER_OFFSETS_MS[index],
    );
  });
});

test("skips expired ANC offsets and invalid appointment values", () => {
  const appointment = new Date(2026, 9, 30, 10, 0, 0);
  const now = new Date(2026, 9, 30, 8, 0, 0);

  assert.equal(ancReminderDates(appointment.toISOString(), now).length, 1);
  assert.deepEqual(ancReminderDates("Week 20", now), []);
});
