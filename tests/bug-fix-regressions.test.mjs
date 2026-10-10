import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { appHarness, React, act, text, pressWithText, root } from './helpers/app-harness.mjs';

const med = { id: 'audit-med', name: 'Audit supplement', dosage: 'fixture', instructions: 'Synthetic', time: '11:00 PM', period: 'Evening', createdDate: '2026-09-01', statusDate: '2026-10-09', taken: false, missed: false };

async function mount(h, path, t, props) {
  const renderer = await h.mount(h.load(path).default, props);
  t.after(async () => { await act(async () => renderer.unmount()); });
  return renderer;
}
function homeHarness(medications = []) {
  const h = appHarness();
  const toggles = [];
  h.mocks.set('react-redux', { useSelector: selector => selector({ dataReducer: { userName: 'Audit User' } }) });
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications, toggleMedicationTaken: (...args) => toggles.push(args) }) });
  h.mocks.set(resolve(root, 'src/pregnancy/usePregnancyProgress.ts'), { usePregnancyProgress: () => null });
  return { h, toggles };
}

test('BUG-09: malformed and inherited article IDs safely show not-found', async t => {
  for (const params of [null, {}, { id: null }, { id: 42 }, { id: [] }, { id: 'toString' }, { id: '__proto__' }, { id: 'constructor' }]) {
    const h = appHarness(); h.route.params = params;
    const renderer = await mount(h, 'src/screens/article/[id].tsx', t);
    assert.ok(text(renderer.toJSON()).includes(h.i18n.t('articleScreen.notFound')));
  }
});

for (const mode of ['date', 'datetime']) {
  test(`BUG-10: clearing a controlled ${mode} input clears both parent and displayed value`, async t => {
    const h = appHarness();
    const Input = h.load('src/components/inputs/DateInput.web.tsx').default;
    let selected;
    function Controlled() {
      const [value, setValue] = React.useState('2026-10-15T12:00:00');
      selected = value;
      return React.createElement(Input, { mode, value, onChange: setValue });
    }
    const renderer = await h.mount(Controlled);
    t.after(async () => { await act(async () => renderer.unmount()); });
    await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '' } }));
    assert.equal(selected, '');
    assert.equal(renderer.root.findByType('input').props.value, '');
  });
}
test('BUG-10: malformed nonempty input does not replace a valid selection', async t => {
  const h = appHarness(); let changes = 0;
  const renderer = await mount(h, 'src/components/inputs/DateInput.web.tsx', t, { value: '2026-10-15', onChange: () => { changes++; } });
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: 'invalid' } }));
  assert.equal(changes, 0);
});

test('BUG-11: empty Home offers the existing localized Add Medication action', async t => {
  for (const language of ['en', 'ne']) {
    const { h } = homeHarness(); await h.i18n.changeLanguage(language);
    const renderer = await mount(h, 'src/screens/home/HomeScreen.tsx', t);
    await pressWithText(renderer, h.i18n.t('medsScreen.addNew'));
    assert.deepEqual(h.navigationCalls.at(-1), ['navigate', 'AddMedication']);
    assert.equal(text(renderer.toJSON()).includes('All medications taken'), false);
  }
});
test('BUG-11: untaken and completed nonempty lists retain their distinct Home actions', async t => {
  const pending = homeHarness([med]);
  const renderer = await mount(pending.h, 'src/screens/home/HomeScreen.tsx', t);
  await pressWithText(renderer, med.name);
  assert.deepEqual(pending.toggles[0], [med.id, '2026-10-09']);
  assert.equal(text(renderer.toJSON()).includes('All medications taken'), false);
  const complete = homeHarness([{ ...med, taken: true }]);
  const completed = await mount(complete.h, 'src/screens/home/HomeScreen.tsx', t);
  assert.ok(text(completed.toJSON()).includes('All medications taken'));
  assert.equal(text(completed.toJSON()).includes(complete.h.i18n.t('medsScreen.addNew')), false);
});

test('BUG-17: checkbox toggles its checked state without opening medication details', async t => {
  const h = appHarness(); let records = []; const toggles = [];
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [med], adherenceHistory: records,
    toggleMedicationTaken(id, date) { toggles.push({ id, date }); records = records.length ? [] : [{ medicationId: id, date, status: 'taken' }]; },
  }) });
  const Screen = h.load('src/screens/meds/MedsScreen.tsx').default;
  const renderer = await h.mount(Screen);
  t.after(async () => { await act(async () => renderer.unmount()); });
  const checkbox = () => renderer.root.findAllByType('TouchableOpacity').find(node => node.props.accessibilityRole === 'checkbox');
  assert.equal(checkbox().parent.type, 'View'); // Sibling of the details button, not a nested button.
  assert.equal(checkbox().props.accessibilityState.checked, false);
  assert.equal(checkbox().props['aria-checked'], false);
  assert.equal(checkbox().props.accessibilityState.disabled, false);
  for (const checked of [true, false]) {
    await act(async () => checkbox().props.onPress({ stopPropagation() {} }));
    await act(async () => renderer.update(React.createElement(Screen)));
    assert.equal(checkbox().props.accessibilityState.checked, checked);
    assert.equal(checkbox().props['aria-checked'], checked);
  }
  assert.deepEqual(toggles, [{ id: med.id, date: '2026-10-09' }, { id: med.id, date: '2026-10-09' }]);
  assert.equal(h.navigationCalls.length, 0);
  const details = renderer.root.findAllByType('TouchableOpacity').find(node => node.props.accessibilityRole === 'button' && node.props.accessibilityLabel.includes(med.name));
  await act(async () => details.props.onPress());
  assert.equal(h.navigationCalls.at(-1)[1], 'MedicationDetails');
  assert.equal(h.navigationCalls.at(-1)[2].id, med.id);
});
test('BUG-17: historic doses expose disabled state and cannot be toggled', async t => {
  const h = appHarness(); let toggles = 0;
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [med], adherenceHistory: [], toggleMedicationTaken() { toggles++; } }) });
  const renderer = await mount(h, 'src/screens/meds/MedsScreen.tsx', t);
  await pressWithText(renderer, 'Tue 6', 'TouchableOpacity');
  const checkbox = renderer.root.findAllByType('TouchableOpacity').find(node => node.props.accessibilityRole === 'checkbox');
  assert.equal(checkbox.props.disabled, true);
  assert.equal(checkbox.props.accessibilityState.disabled, true);
  assert.equal(checkbox.props['aria-disabled'], true);
  await act(async () => checkbox.props.onPress({ stopPropagation() {} }));
  assert.equal(toggles, 0);
});

const requirePackage = createRequire(resolve(root, 'package.json'));
const shellQuote = requirePackage('shell-quote');
test('BUG-23: installed and locked shell-quote versions contain the critical security patch', () => {
  const installed = requirePackage('shell-quote/package.json').version;
  const locked = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')).packages['node_modules/shell-quote'].version;
  assert.equal(installed, locked);
  const [major, minor] = installed.split('.').map(Number);
  assert.ok(major > 1 || (major === 1 && minor >= 11), `Vulnerable shell-quote ${installed}`);
});
test('BUG-23: quoting rejects every line terminator after a comment token', () => {
  // Only call the quote function. Never execute its output in a shell.
  for (const terminator of ['\n', '\r', '\u2028', '\u2029']) {
    assert.throws(() => shellQuote.quote(['example', { comment: 'audit' }, `first${terminator}second`]), TypeError);
  }
});
test('BUG-23: ordinary quoted arguments still round-trip through the parser', () => {
  const args = ['example', 'two words', "apostrophe's", 'double"quote', ''];
  assert.deepEqual(shellQuote.parse(shellQuote.quote(args)), args);
});

test('BUG-09: unknown article without route parameters shows not-found instead of throwing', async t => {
  const h = appHarness();
  h.route.params = undefined;
  const renderer = await h.mount(h.load('src/screens/article/[id].tsx').default);
  t.after(async () => { await act(async () => renderer.unmount()); });
  assert.ok(text(renderer.toJSON()).includes(h.i18n.t('articleScreen.notFound')));
});

test('BUG-10: clearing a web date input clears the value used when saving', async t => {
  const h = appHarness();
  let selected = '2026-10-15';
  const renderer = await h.mount(h.load('src/components/inputs/DateInput.web.tsx').default, { value: selected, onChange: value => { selected = value; } });
  t.after(async () => { await act(async () => renderer.unmount()); });
  await act(async () => renderer.root.findByType('input').props.onChange({ currentTarget: { value: '' } }));
  assert.equal(selected, '');
});

test('BUG-11: Home shows an empty medication state when no medication exists', async t => {
  const h = appHarness();
  h.mocks.set('react-redux', { useSelector: selector => selector({ dataReducer: { userName: 'Audit User' } }) });
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [], toggleMedicationTaken() {} }) });
  h.mocks.set(resolve(root, 'src/pregnancy/usePregnancyProgress.ts'), { usePregnancyProgress: () => null });
  const renderer = await h.mount(h.load('src/screens/home/HomeScreen.tsx').default);
  t.after(async () => { await act(async () => renderer.unmount()); });
  assert.equal(text(renderer.toJSON()).includes('All medications taken'), false);
});

test('BUG-17: medication taken control exposes its name and checked state to accessibility', async t => {
  const h = appHarness();
  h.mocks.set(resolve(root, 'src/context/MedicationContext.tsx'), { useMedications: () => ({ medications: [med], adherenceHistory: [], toggleMedicationTaken() {} }) });
  const renderer = await h.mount(h.load('src/screens/meds/MedsScreen.tsx').default);
  t.after(async () => { await act(async () => renderer.unmount()); });
  const checkbox = renderer.root.findAllByType('TouchableOpacity').find(node => node.props.hitSlop);
  assert.equal(checkbox.props.accessibilityRole, 'checkbox');
  assert.ok(checkbox.props.accessibilityLabel?.includes(med.name));
  assert.equal(checkbox.props.accessibilityState?.checked, false);
});
