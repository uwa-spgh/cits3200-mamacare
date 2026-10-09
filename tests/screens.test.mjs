import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { appHarness, root, React, act, text, pressWithText } from './helpers/app-harness.mjs';

async function screen(h, path, t) {
  const renderer = await h.mount(h.load(path).default);
  t.after(async () => { await act(async () => renderer.unmount()); });
  return renderer;
}
test('Library title search is trimmed and case insensitive, with an empty result state', async t => {
  const h = appHarness();
  const renderer = await screen(h, 'src/screens/library/LibraryScreen.tsx', t);
  await act(async () => renderer.root.findByType('TextInput').props.onChangeText('  NUTRITION  '));
  assert.ok(text(renderer.toJSON()).includes('Healthy Nutrition'));
  assert.equal(text(renderer.toJSON()).includes('Birth Preparedness'), false);
  await act(async () => renderer.root.findByType('TextInput').props.onChangeText('nothing matches this fixture'));
  assert.ok(text(renderer.toJSON()).includes(h.i18n.t('libraryScreen.noTopics')));
});
test('Library filters and topic/danger-sign navigation point to actual destinations', async t => {
  const h = appHarness();
  const renderer = await screen(h, 'src/screens/library/LibraryScreen.tsx', t);
  await pressWithText(renderer, 'Birth Prep');
  assert.ok(text(renderer.toJSON()).includes('Labour Preparation'));
  assert.equal(text(renderer.toJSON()).includes('Healthy Nutrition'), false);
  await pressWithText(renderer, 'Birth Preparedness');
  assert.deepEqual(JSON.parse(JSON.stringify(h.navigationCalls.at(-1))), ['navigate', 'Article', { id: 'birth-preparedness' }]);
  await pressWithText(renderer, 'Danger Signs');
  assert.deepEqual(h.navigationCalls.at(-1), ['navigate', 'DangerSigns']);
});
test('Library searches Nepali titles while Nepali is selected', async t => {
  const h = appHarness({ language: 'ne' });
  const renderer = await screen(h, 'src/screens/library/LibraryScreen.tsx', t);
  const title = h.i18n.t('libraryScreen.topics.healthy-nutrition.title');
  await act(async () => renderer.root.findByType('TextInput').props.onChangeText(title));
  assert.ok(text(renderer.toJSON()).includes(title));
  const grid = renderer.root.find(node => typeof node.type === 'function' && node.type.name === 'TopicGrid');
  assert.equal(grid.props.topics.length, 1);
  assert.equal(grid.props.topics[0].id, 'healthy-nutrition');
});
for (const id of ['healthy-nutrition', 'anc-visits', 'maternal-immunisation', 'birth-preparedness', 'labour-preparation', 'breastfeeding-preparation', 'general-pregnancy-advice']) {
  test(`Article ${id} renders full translated content in both languages`, async t => {
    for (const language of ['en', 'ne']) {
      const h = appHarness({ language });
      h.route.params = { id };
      const renderer = await screen(h, 'src/screens/article/[id].tsx', t);
      assert.ok(text(renderer.toJSON()).includes(h.i18n.t(`articles.${id}.title`)));
      assert.ok(renderer.root.findAllByType('Text').length > 5);
    }
  });
}
test('unknown article ID has a readable fallback', async t => {
  const h = appHarness(); h.route.params = { id: 'unknown-fixture' };
  const renderer = await screen(h, 'src/screens/article/[id].tsx', t);
  assert.ok(text(renderer.toJSON()).includes(h.i18n.t('articleScreen.notFound')));
});
test('Danger Signs screen renders general signs and expands each ANC section', async t => {
  const h = appHarness();
  const renderer = await screen(h, 'src/screens/library/danger-signs.tsx', t);
  assert.ok(text(renderer.toJSON()).includes('Heavy Vaginal Bleeding'));
  for (let contact = 1; contact <= 8; contact++) {
    const accordion = renderer.root.findAll(node => typeof node.type === 'function' && node.type.name === 'ContactDangerSignsAccordion').find(node => node.props.contact.contact === contact);
    await act(async () => accordion.props.onToggle());
    assert.equal(renderer.root.findAll(node => typeof node.type === 'function' && node.type.name === 'ContactDangerSignsAccordion').find(node => node.props.contact.contact === contact).props.expanded, contact !== 1);
  }
});
test('Add Medication disables empty/invalid input and saves trimmed valid values', async t => {
  const h = appHarness(); let saved;
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ addMedication: value => { saved = value; } }) });
  const renderer = await screen(h, 'src/screens/meds/addMedication.tsx', t);
  const save = () => renderer.root.findAllByType('TouchableOpacity').find(n => n.props.accessibilityRole === 'button');
  assert.equal(save().props.disabled, true);
  const inputs = renderer.root.findAllByType('TextInput');
  await act(async () => { inputs[0].props.onChangeText('  Audit supplement  '); inputs[3].props.onChangeText('25:00 AM'); });
  assert.equal(save().props.disabled, true);
  assert.ok(text(renderer.toJSON()).includes(h.i18n.t('addMedicationScreen.timeError')));
  await act(async () => inputs[3].props.onChangeText(' 8:00 AM '));
  assert.equal(save().props.disabled, false);
  await act(async () => save().props.onPress());
  assert.equal(saved.name, 'Audit supplement');
  assert.equal(saved.time, '8:00 AM');
  assert.deepEqual(h.navigationCalls.at(-1), ['back']);
});
test('Medication Details shows deleted/unknown items safely', async t => {
  const h = appHarness(); h.route.params = { id: 'deleted-fixture' };
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [], updateMedication() {}, removeMedication() {} }) });
  const renderer = await screen(h, 'src/screens/meds/medicationDetails.tsx', t);
  assert.ok(text(renderer.toJSON()).includes(h.i18n.t('medicationDetailsScreen.notFound')));
});
test('Planner appointments, notes and completion are saved and restored', async t => {
  const h = appHarness(); h.setPlannerRoute('VisitChecklist', { visitId: 'anc-2' });
  const renderer = await screen(h, 'src/screens/planner/PlannerScreen.tsx', t);
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '2026-10-20T10:00' } }));
  const inputs = renderer.root.findAllByType('TextInput');
  await act(async () => { inputs.find(n => !n.props.multiline).props.onChangeText('Audit clinic'); inputs.find(n => n.props.multiline).props.onChangeText('Synthetic provider question'); });
  await pressWithText(renderer, h.i18n.t('plannerScreen.completeVisit'));
  const stored = JSON.parse(h.values.get('mamacare:planner'));
  assert.equal(stored.appointments['anc-2'].facility, 'Audit clinic');
  assert.equal(stored.notes['anc-2'], 'Synthetic provider question');
  assert.ok(stored.completedVisits.includes('anc-2'));
  const h2 = appHarness({ stored: Object.fromEntries(h.values) }); h2.setPlannerRoute('VisitChecklist', { visitId: 'anc-2' });
  const restored = await screen(h2, 'src/screens/planner/PlannerScreen.tsx', t);
  assert.equal(restored.root.findAllByType('TextInput').find(n => n.props.multiline).props.value, 'Synthetic provider question');
  assert.ok(text(restored.toJSON()).includes(h2.i18n.t('plannerScreen.visitCompleted')));
});
test('web DateInput serializes selected calendar date and datetime correctly', async t => {
  const h = appHarness(); let value;
  const Component = h.load('src/components/inputs/DateInput.web.tsx').default;
  const renderer = await h.mount(Component, { onChange: next => { value = next; } });
  t.after(async () => { await act(async () => renderer.unmount()); });
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '2026-10-15' } }));
  assert.equal(new Date(value).getDate(), 15);
  await act(async () => renderer.update(React.createElement(Component, { mode: 'datetime', onChange: next => { value = next; } })));
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '2026-10-15T14:30' } }));
  assert.equal(new Date(value).getHours(), 14);
  assert.equal(new Date(value).getMinutes(), 30);
});
