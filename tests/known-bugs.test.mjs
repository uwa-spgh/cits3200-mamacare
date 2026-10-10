import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { appHarness, React, act, text, pressWithText, knownBug, root } from './helpers/app-harness.mjs';

async function context(h, file, provider, hook, t) {
  const module = h.load(file);
  let current;
  function Consumer() { current = module[hook](); return null; }
  const renderer = await h.mount(module[provider], { children: React.createElement(Consumer) });
  t.after(async () => { await act(async () => renderer.unmount()); });
  return { renderer, current: () => current };
}
const med = { id: 'audit-med', name: 'Audit supplement', dosage: 'fixture', instructions: 'Synthetic', time: '11:00 PM', period: 'Evening', createdDate: '2026-10-08', statusDate: '2026-10-09', taken: false, missed: false };

knownBug(test, 'BUG-01', 'saved personal information survives a provider restart', async t => {
  const h = appHarness();
  const first = await context(h, 'src/context/PersonalInformationContext.tsx', 'PersonalInformationProvider', 'usePersonalInformation', t);
  await act(async () => first.current().savePersonalInformation({ fullName: 'Audit User', dateOfBirth: new Date(2000, 0, 1), height: '165', weight: '60', gender: 'Female', phoneNumber: '0000000000' }));
  await act(async () => first.renderer.unmount());
  const second = await context(h, 'src/context/PersonalInformationContext.tsx', 'PersonalInformationProvider', 'usePersonalInformation', t);
  assert.equal(second.current().personalInformation.fullName, 'Audit User');
});
knownBug(test, 'BUG-02', 'saved medical history survives a provider restart', async t => {
  const h = appHarness();
  const first = await context(h, 'src/context/MedicalHistoryContext.tsx', 'MedicalHistoryProvider', 'useMedicalHistory', t);
  await act(async () => first.current().saveMedicalHistory({ conditions: ['Fixture'], allergies: ['Fixture allergy'] }));
  await act(async () => first.renderer.unmount());
  const second = await context(h, 'src/context/MedicalHistoryContext.tsx', 'MedicalHistoryProvider', 'useMedicalHistory', t);
  assert.equal(second.current().medicalHistory.allergies[0], 'Fixture allergy');
});
knownBug(test, 'BUG-03', 'delayed storage loading preserves a previously taken medication record', async t => {
  const record = { id: 'audit-taken', medicationId: med.id, medicationName: med.name, date: '2026-10-08', time: med.time, status: 'taken' };
  const h = appHarness({ stored: { 'mamacare:medications': JSON.stringify([med]), mamacare_adherence_history: JSON.stringify([record]) } });
  h.storage.getItem = async key => { await new Promise(resolve => setImmediate(resolve)); return h.values.get(key) ?? null; };
  const mounted = await context(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  await h.flush();
  assert.equal(mounted.current().adherenceHistory.find(r => r.date === record.date)?.status, 'taken');
});
knownBug(test, 'BUG-04', 'a storage read failure does not erase medication data on disk', async t => {
  const saved = JSON.stringify([med]);
  const h = appHarness({ stored: { 'mamacare:medications': saved } });
  h.storage.getItem = async () => { throw new Error('Simulated storage read failure'); };
  await context(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  assert.equal(h.values.get('mamacare:medications'), saved);
});
knownBug(test, 'BUG-05', 'two medications added within the same millisecond have different IDs', async t => {
  const h = appHarness();
  const mounted = await context(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  await act(async () => { mounted.current().addMedication(med); mounted.current().addMedication({ ...med, name: 'Second fixture' }); });
  assert.equal(new Set(mounted.current().medications.map(m => m.id)).size, 2);
});
knownBug(test, 'BUG-07', 'changing language preserves the meaning of a checked ANC item', async t => {
  const h = appHarness();
  h.setPlannerRoute('VisitChecklist', { visitId: 'anc-2' });
  const Screen = h.load('src/screens/planner/PlannerScreen.tsx').default;
  const renderer = await h.mount(Screen);
  t.after(async () => { await act(async () => renderer.unmount()); });
  const checklist = () => renderer.root.findAllByType('Pressable').filter(n => text(n).includes(h.i18n.t('plannerScreen.contacts.anc-2.checks.0')));
  await act(async () => checklist()[0].props.onPress());
  await h.i18n.changeLanguage('ne');
  await act(async () => renderer.update(React.createElement(Screen)));
  assert.ok(checklist()[0].findAllByType('Ionicons').some(n => n.props.name === 'checkmark'));
});
for (const field of ['height', 'weight']) {
  knownBug(test, 'BUG-08', `personal-information validation rejects non-numeric ${field}`, async t => {
    const h = appHarness();
    let saved = false;
    h.mocks.set(resolve(root, 'src/context/PersonalInformationContext.tsx'), { usePersonalInformation: () => ({
      personalInformation: { fullName: 'Audit User', dateOfBirth: new Date(2000, 0, 1), height: field === 'height' ? 'abc' : '165', weight: field === 'weight' ? 'abc' : '60', gender: 'Female', phoneNumber: '0000000000' },
      savePersonalInformation() { saved = true; },
    }) });
    const renderer = await h.mount(h.load('src/screens/profile/PersonalInformationScreen.tsx').default);
    t.after(async () => { await act(async () => renderer.unmount()); });
    await pressWithText(renderer, 'Save', 'TouchableOpacity');
    assert.equal(saved, false);
  });
}
knownBug(test, 'BUG-12', 'typed EDD outside the picker maximum cannot advance onboarding', async t => {
  const h = appHarness();
  let saves = 0;
  h.mocks.set('react-redux', { useSelector: selector => selector({ dataReducer: { edd: '' } }) });
  h.mocks.set(resolve(root, 'src/store/store.ts'), { saveDueDate: async () => { saves++; } });
  const renderer = await h.mount(h.load('src/screens/auth/InitialSetupScreen.tsx').default);
  t.after(async () => { await act(async () => renderer.unmount()); });
  await pressWithText(renderer, 'Due Date (EDD)', 'TouchableOpacity');
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '2035-10-15' } }));
  const buttons = renderer.root.findAllByType('TouchableOpacity');
  const next = buttons.find(n => text(n).includes('Next'));
  await act(async () => next.props.onPress());
  assert.equal(saves, 0);
});

function prepareHome(h) {
  h.mocks.set('react-redux', { useSelector: selector => selector({ dataReducer: { userName: 'Asha Sharma' } }) });
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [], toggleMedicationTaken() {} }) });
  h.mocks.set(resolve(root, 'src/pregnancy/usePregnancyProgress.ts'), { usePregnancyProgress: () => null });
  return h.load('src/screens/home/HomeScreen.tsx').default;
}
knownBug(test, 'BUG-14', 'Home ANC summary uses the saved Planner appointment', async t => {
  const h = appHarness({ stored: { 'mamacare:planner': JSON.stringify({ completedVisits: ['anc-1'], appointments: { 'anc-2': { date: new Date(2026, 9, 10, 10).toISOString(), facility: 'Audit clinic' } } }) } });
  const renderer = await h.mount(prepareHome(h));
  t.after(async () => { await act(async () => renderer.unmount()); });
  assert.ok(text(renderer.toJSON()).includes('Audit clinic'));
});
knownBug(test, 'BUG-15', 'saving personal information updates the Home greeting', async t => {
  const h = appHarness(); const Home = prepareHome(h);
  const { PersonalInformationProvider, usePersonalInformation } = h.load('src/context/PersonalInformationContext.tsx');
  let information;
  function Child() { information = usePersonalInformation(); return React.createElement(Home); }
  const renderer = await h.mount(PersonalInformationProvider, { children: React.createElement(Child) });
  t.after(async () => { await act(async () => renderer.unmount()); });
  await act(async () => information.savePersonalInformation({ fullName: 'Audit User', dateOfBirth: new Date(2000, 0, 1), height: '165', weight: '60', gender: 'Female', phoneNumber: '0000000000' }));
  assert.ok(text(renderer.toJSON()).includes('Hello, Audit'));
});
knownBug(test, 'BUG-16', 'marking taken records the action time instead of the scheduled time', async t => {
  const h = appHarness();
  const mounted = await context(h, 'src/context/MedicationContext.tsx', 'MedicationProvider', 'useMedications', t);
  await act(async () => mounted.current().addMedication(med));
  const id = mounted.current().medications[0].id;
  await act(async () => mounted.current().toggleMedicationTaken(id, '2026-10-09'));
  assert.notEqual(mounted.current().adherenceHistory[0].time, med.time);
});
