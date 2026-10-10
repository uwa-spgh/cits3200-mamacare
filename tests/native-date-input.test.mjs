import test from 'node:test';
import assert from 'node:assert/strict';
import { appHarness, act, pressWithText } from './helpers/app-harness.mjs';

test('iOS date picker commits only on confirmation; cancellation leaves previous date', async t => {
  const h = appHarness({ platform: 'ios' }); let saved;
  const renderer = await h.mount(h.load('src/components/inputs/DateInput.native.tsx').default, { value: new Date(2026, 9, 15).toISOString(), onChange: value => { saved = value; } });
  t.after(async () => { await act(async () => renderer.unmount()); });
  await act(async () => renderer.root.findAllByType('Pressable')[0].props.onPress());
  assert.equal(renderer.root.findByType('Modal').props.visible, true);
  await act(async () => renderer.root.findByType('DateTimePicker').props.onChange({ type: 'set' }, new Date(2026, 9, 20)));
  assert.equal(saved, undefined);
  await act(async () => renderer.root.findByType('Modal').props.onRequestClose());
  assert.equal(renderer.root.findByType('Modal').props.visible, false);
  assert.equal(saved, undefined);
  await act(async () => renderer.root.findAllByType('Pressable')[0].props.onPress());
  await act(async () => renderer.root.findByType('DateTimePicker').props.onChange({ type: 'set' }, new Date(2026, 9, 21)));
  await pressWithText(renderer, h.i18n.t('languageBottomSheet.confirm'));
  assert.equal(new Date(saved).getDate(), 21);
  assert.equal(renderer.root.findByType('Modal').props.visible, false);
});
test('Android datetime picker combines separate date/time choices and ignores dismissal', async t => {
  const h = appHarness({ platform: 'android' }); let saved; const opened = [];
  h.mocks.set('@react-native-community/datetimepicker', { __esModule: true, default: 'DateTimePicker', DateTimePickerAndroid: { open: options => opened.push(options) } });
  const renderer = await h.mount(h.load('src/components/inputs/DateInput.native.tsx').default, { mode: 'datetime', onChange: value => { saved = value; } });
  t.after(async () => { await act(async () => renderer.unmount()); });
  await act(async () => renderer.root.findAllByType('Pressable')[0].props.onPress());
  assert.equal(opened[0].mode, 'date');
  await act(async () => opened[0].onChange({ type: 'dismissed' }));
  assert.equal(saved, undefined);
  await act(async () => opened[0].onChange({ type: 'set' }, new Date(2026, 9, 15)));
  assert.equal(opened[1].mode, 'time');
  await act(async () => opened[1].onChange({ type: 'set' }, new Date(2026, 9, 15, 14, 30)));
  assert.equal(new Date(saved).getDate(), 15); assert.equal(new Date(saved).getHours(), 14); assert.equal(new Date(saved).getMinutes(), 30);
});
