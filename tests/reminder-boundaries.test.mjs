import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMedicationTime, medicationReminderDates, medicationReminderOccurrences, ancReminderDates, localDateKey } from '../src/notifications/planning.ts';

test('medication parsing handles noon/midnight, whitespace, case and Nepali digits', () => {
  for (const [value, hour, minute] of [['12:00 AM', 0, 0], ['12:00 PM', 12, 0], [' 8:05 pm ', 20, 5], ['बिहान ८:०५', 8, 5], ['दिउँसो १२:००', 12, 0], ['साँझ ६:३०', 18, 30]]) {
    assert.deepEqual(parseMedicationTime(value), { hour, minute });
  }
  for (const value of ['', '08:00', '0:00 AM', '13:00 PM', '1:60 PM', 'hello']) assert.equal(parseMedicationTime(value), null);
});
test('schedules exclude an already reached minute and keep local time across DST/month rollover', () => {
  const medication = { id: 'm', name: 'Fixture', dosage: '', instructions: '', time: '9:00 AM', taken: false };
  const now = new Date(2026, 9, 31, 9, 0);
  const dates = medicationReminderDates(medication, now, 4);
  assert.equal(dates.length, 3);
  assert.equal(localDateKey(dates[0]), '2026-11-01');
  for (const date of dates) { assert.equal(date.getHours(), 9); assert.equal(date.getMinutes(), 0); }
});
test('yesterday taken state does not suppress today; current-day state does', () => {
  const now = new Date(2026, 9, 9, 8, 0);
  const medication = { id: 'm', name: 'Fixture', dosage: '', instructions: '', time: '9:00 AM', taken: true, statusDate: '2026-10-08' };
  assert.equal(medicationReminderDates(medication, now, 1).length, 1);
  assert.equal(medicationReminderDates({ ...medication, statusDate: '2026-10-09' }, now, 1).length, 0);
});
test('empty and exhausted queues produce no occurrences, ties are deterministic', () => {
  const now = new Date(2026, 9, 9, 8);
  const a = { id: 'a', name: 'Fixture', dosage: '', instructions: '', time: '9:00 AM', taken: false };
  assert.deepEqual(medicationReminderOccurrences([], now, 60), []);
  assert.deepEqual(medicationReminderOccurrences([a], now, 0), []);
  assert.deepEqual(medicationReminderOccurrences([a], now, -5), []);
  assert.deepEqual(medicationReminderOccurrences([{ ...a, id: 'b' }, a], now, 2).map(o => o.medication.id), ['a', 'b']);
});
test('ANC excludes offsets at exactly now, expired visits and invalid dates', () => {
  const now = new Date('2026-10-09T04:00:00Z');
  assert.equal(ancReminderDates('2026-10-09T05:00:00Z', now).length, 0);
  assert.equal(ancReminderDates('2026-10-09T05:01:00Z', now).length, 1);
  assert.equal(ancReminderDates('2026-10-01T05:00:00Z', now).length, 0);
  assert.equal(ancReminderDates('Week 20', now).length, 0);
});
