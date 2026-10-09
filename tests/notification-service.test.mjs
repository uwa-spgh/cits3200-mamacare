import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { appHarness, root, knownBug } from './helpers/app-harness.mjs';

export function reminderService({ stored = {}, permission = 'granted', language = 'en' } = {}) {
  const h = appHarness({ stored, language });
  let pending = [];
  let nextId = 0;
  let failNext = false;
  const scheduled = [];
  const cancelled = [];
  const adapter = {
    configureNotificationPlatform: async () => {},
    getNotificationPermission: async () => permission,
    requestNotificationPermission: async () => permission,
    getPendingReminders: async () => pending.map(item => ({ ...item })),
    cancelReminder: async id => { cancelled.push(id); pending = pending.filter(item => item.id !== id); },
    scheduleReminder: async request => {
      if (failNext) { failNext = false; throw new Error('Simulated scheduling failure'); }
      const id = `fixture-${++nextId}`;
      scheduled.push(request);
      pending.push({ id, title: request.title, body: request.body, data: request.data });
      return id;
    },
  };
  h.mocks.delete(resolve(root, 'src/notifications/notificationService.ts'));
  h.mocks.set(resolve(root, 'src/notifications/notificationAdapter.ts'), adapter);
  const service = h.load('src/notifications/notificationService.ts');
  return { h, service, scheduled, cancelled, pending: () => pending, failOnce: () => { failNext = true; } };
}
const medication = { id: 'm1', name: 'Audit supplement', dosage: 'fixture', instructions: '', time: '11:00 PM', taken: false, statusDate: '2026-10-09' };

test('notification preferences default, persist, merge partial values and recover malformed JSON', async () => {
  const { h, service } = reminderService();
  assert.equal((await service.loadNotificationPreferences()).anc, true);
  await service.saveNotificationPreferences({ anc: false, medication: true, education: false });
  assert.equal((await service.loadNotificationPreferences()).education, false);
  h.values.set('mamacare:notification-preferences', '{broken');
  assert.equal((await service.loadNotificationPreferences()).medication, true);
  h.values.set('mamacare:notification-preferences', JSON.stringify({ anc: false }));
  const loaded = await service.loadNotificationPreferences();
  assert.equal(loaded.anc, false);
  assert.equal(loaded.medication, true);
});
test('all reminders fill at most 60 slots; ANC and education are allocated before medications', async () => {
  const { service, pending, scheduled } = reminderService({ stored: {
    'mamacare:medications': JSON.stringify([medication, { ...medication, id: 'm2', time: '1:00 PM' }, { ...medication, id: 'm3', time: '3:00 PM' }]),
    'mamacare:planner': JSON.stringify({ appointments: { 'anc-2': { date: new Date(2026, 9, 20, 10).toISOString(), facility: 'Audit clinic' } }, completedVisits: [] }),
  } });
  await service.syncAllNotifications();
  assert.equal(pending().length, 60);
  assert.equal(pending().filter(r => r.data.kind === 'anc').length, 3);
  assert.equal(pending().filter(r => r.data.kind === 'education').length, 1);
  assert.equal(pending().filter(r => r.data.kind === 'medication').length, 56);
  const times = scheduled.filter(r => r.data.kind === 'medication').map(r => r.date.getTime());
  assert.ok(times.every((time, index) => !index || time >= times[index - 1]));
});
test('medication edits replace old pending requests and deletion removes them', async () => {
  const { service, pending, cancelled } = reminderService();
  await service.syncMedicationNotifications([medication]);
  assert.equal(pending().length, 30);
  const oldIds = pending().map(item => item.id);
  await service.syncMedicationNotifications([{ ...medication, time: '1:00 PM' }]);
  assert.ok(oldIds.every(id => cancelled.includes(id)));
  assert.equal(pending().length, 30);
  await service.syncMedicationNotifications([]);
  assert.equal(pending().length, 0);
});
test('marking taken cancels today only and switching the category off cancels all medication reminders', async () => {
  const { h, service, pending } = reminderService();
  await service.syncMedicationNotifications([medication]);
  await service.syncMedicationNotifications([{ ...medication, taken: true }]);
  assert.equal(pending().length, 29);
  assert.equal(pending().some(r => r.data.occurrenceDate === '2026-10-09'), false);
  h.values.set('mamacare:notification-preferences', JSON.stringify({ medication: false }));
  await service.syncMedicationNotifications([medication]);
  assert.equal(pending().length, 0);
});
test('completed ANC visits cancel all their remaining notifications', async () => {
  const { service, pending } = reminderService();
  const state = { appointments: { 'anc-2': { date: new Date(2026, 9, 20, 10).toISOString(), facility: 'Audit clinic' } }, completedVisits: [] };
  await service.syncAncNotifications(state);
  assert.equal(pending().length, 3);
  await service.syncAncNotifications({ ...state, completedVisits: ['anc-2'] });
  assert.equal(pending().length, 0);
});
test('weekly education is Saturday 10:00 and a language change rebuilds the copy', async () => {
  const { h, service, scheduled, pending } = reminderService();
  await service.syncEducationNotification();
  assert.equal(scheduled[0].weekly.weekday, 7);
  assert.equal(scheduled[0].weekly.hour, 10);
  await h.i18n.changeLanguage('ne');
  await service.syncEducationNotification();
  assert.equal(pending().length, 1);
  assert.match(pending()[0].title, /[\u0900-\u097F]/);
});
test('permission denial schedules nothing, even when reminders are enabled', async () => {
  const { service, scheduled } = reminderService({ permission: 'denied' });
  await service.syncMedicationNotifications([medication]);
  await service.syncAncNotifications({ appointments: { 'anc-2': { date: new Date(2026, 9, 20, 10).toISOString() } } });
  await service.syncEducationNotification();
  assert.equal(scheduled.length, 0);
});
test('a rejected scheduling request does not poison the next synchronization', async () => {
  const { service, failOnce, pending } = reminderService();
  failOnce();
  await assert.rejects(service.syncMedicationNotifications([medication]), /Simulated/);
  await service.syncMedicationNotifications([medication]);
  assert.equal(pending().length, 30);
});
test('concurrent medication synchronizations finish with the latest schedule', async () => {
  const { service, pending } = reminderService();
  await Promise.all([service.syncMedicationNotifications([medication]), service.syncMedicationNotifications([])]);
  assert.equal(pending().length, 0);
});

// Export helpers only; known-defect assertions are registered in known-bugs.test.mjs.
