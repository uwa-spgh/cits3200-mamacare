import test from 'node:test';
import assert from 'node:assert/strict';
import { appHarness, React, act } from './helpers/app-harness.mjs';

export async function mountContext(h, modulePath, providerName, hookName, t) {
  const module = h.load(modulePath);
  let current;
  function Consumer() { current = module[hookName](); return null; }
  const renderer = await h.mount(module[providerName], { children: React.createElement(Consumer) });
  t.after(async () => { await act(async () => renderer.unmount()); });
  return { renderer, current: () => current };
}
const med = { name: 'Audit supplement', dosage: 'fixture', instructions: 'Synthetic test data', time: '11:00 PM', period: 'Evening' };

test('personal information saves for the current session', async t => {
  const h = appHarness();
  const context = await mountContext(h, 'src/context/PersonalInformationContext.tsx', 'PersonalInformationProvider', 'usePersonalInformation', t);
  await act(async () => context.current().savePersonalInformation({ fullName: 'Audit User', dateOfBirth: new Date(2000, 0, 1), height: '165', weight: '60', gender: 'Female', phoneNumber: '0000000000' }));
  assert.equal(context.current().personalInformation.fullName, 'Audit User');
});
test('medical history saves conditions and allergies for the current session', async t => {
  const h = appHarness();
  const context = await mountContext(h, 'src/context/MedicalHistoryContext.tsx', 'MedicalHistoryProvider', 'useMedicalHistory', t);
  await act(async () => context.current().saveMedicalHistory({ conditions: ['Fixture condition'], allergies: ['Fixture allergy'] }));
  assert.equal(context.current().medicalHistory.allergies[0], 'Fixture allergy');
});
test('medication add, edit, take, untake, remove and restore use the real provider', async t => {
  const h = appHarness();
  const context = await mountContext(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  await act(async () => context.current().addMedication(med));
  const id = context.current().medications[0].id;
  assert.equal(context.current().medications[0].createdDate, '2026-10-09');
  await act(async () => context.current().updateMedication(id, { name: 'Edited audit supplement' }));
  await act(async () => context.current().toggleMedicationTaken(id, '2026-10-09'));
  assert.equal(context.current().medications[0].taken, true);
  assert.equal(context.current().adherenceHistory.filter(record => record.date === '2026-10-09').length, 1);
  assert.equal(JSON.parse(h.values.get('mamacare:medications'))[0].name, 'Edited audit supplement');
  await act(async () => context.current().toggleMedicationTaken(id, '2026-10-09'));
  assert.equal(context.current().medications[0].taken, false);
  assert.equal(context.current().adherenceHistory.filter(record => record.date === '2026-10-09').length, 0);
  const h2 = appHarness({ stored: Object.fromEntries(h.values) });
  const restored = await mountContext(h2, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  assert.equal(restored.current().medications[0].name, 'Edited audit supplement');
  await act(async () => restored.current().removeMedication(id));
  assert.equal(restored.current().medications.length, 0);
  assert.equal(h2.values.get('mamacare:medications'), '[]');
  assert.ok(h.notificationCalls.length > 0);
});
test('yesterday edits do not change today and older days are backfilled as missed', async t => {
  const h = appHarness({ stored: { 'mamacare:medications': JSON.stringify([{ ...med, id: 'm', createdDate: '2026-10-06', statusDate: '2026-10-09', taken: false, missed: false }]) } });
  const context = await mountContext(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  assert.equal(context.current().adherenceHistory.length, 3);
  await act(async () => context.current().toggleMedicationTaken('m', '2026-10-08'));
  assert.equal(context.current().medications[0].taken, false);
  assert.equal(context.current().adherenceHistory.find(r => r.date === '2026-10-08').status, 'taken');
  assert.equal(context.current().adherenceHistory.length, 3);
});
test('new local day resets taken status and removes its app-state listener on unmount', async t => {
  const h = appHarness({ stored: { 'mamacare:medications': JSON.stringify([{ ...med, id: 'm', createdDate: '2026-10-09', statusDate: '2026-10-09', taken: true, missed: false }]) } });
  const context = await mountContext(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  h.setClock(new Date(2026, 9, 10, 0, 1));
  await h.tick();
  assert.equal(context.current().medications[0].taken, false);
  assert.equal(context.current().medications[0].statusDate, '2026-10-10');
  await act(async () => context.renderer.unmount());
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});
test('past scheduled medication becomes missed when the polling timer runs', async t => {
  const h = appHarness();
  const context = await mountContext(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  await act(async () => context.current().addMedication({ ...med, time: '8:00 AM' }));
  await h.tick();
  assert.equal(context.current().medications[0].missed, true);
  assert.equal(context.current().adherenceHistory[0].status, 'missed');
});
