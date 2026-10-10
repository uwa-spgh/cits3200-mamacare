import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { appHarness, root, act, React } from './helpers/app-harness.mjs';

for (const kind of ['medication', 'anc', 'education']) for (const hasMainApp of [true, false]) {
  test(`${kind} reminder opens the intended destination on ${hasMainApp ? 'warm' : 'cold'} start`, async t => {
    const h = appHarness(); let cleared = 0;
    h.mocks.set(resolve(root, 'src/notifications/notificationAdapter.ts'), {
      getLastReminderResponse: () => ({ id: 'fixture', data: { mamaCareReminder: true, kind, sourceId: 'fixture-source' } }),
      addReminderResponseListener: () => () => {}, clearLastReminderResponse: () => { cleared++; },
    });
    h.mocks.set(resolve(root, 'src/notifications/notificationService.ts'), { initializeNotifications: async () => 'granted', syncAllNotifications: async () => {} });
    const navigationRef = { ...h.navigation, isReady: () => true, getRootState: () => ({ routes: [{ name: hasMainApp ? 'MainAppBottomTabs' : 'AuthStack' }] }) };
    const Component = h.load('src/notifications/NotificationCoordinator.tsx').default;
    const renderer = await h.mount(Component, { navigationReady: false, navigationRef });
    t.after(async () => { await act(async () => renderer.unmount()); });
    assert.equal(h.navigationCalls.length, 0);
    await act(async () => renderer.update(React.createElement(Component, { navigationReady: true, navigationRef })));
    assert.equal(h.navigationCalls.length, 1);
    assert.equal(cleared, 1);
    const call = h.navigationCalls[0];
    const serialized = JSON.stringify(call);
    if (kind === 'medication') { assert.ok(serialized.includes('MedicationDetails')); assert.ok(serialized.includes('fixture-source')); }
    if (kind === 'anc') { assert.ok(serialized.includes('VisitChecklist')); assert.ok(serialized.includes('fixture-source')); }
    if (kind === 'education') assert.ok(serialized.includes('Library'));
    assert.equal(call[0], hasMainApp ? 'navigate' : 'reset');
  });
}
test('unowned notification payload does not change navigation', async t => {
  const h = appHarness();
  h.mocks.set(resolve(root, 'src/notifications/notificationAdapter.ts'), { getLastReminderResponse: () => ({ id: 'fixture', data: { kind: 'education' } }), addReminderResponseListener: () => () => {}, clearLastReminderResponse() {} });
  h.mocks.set(resolve(root, 'src/notifications/notificationService.ts'), { initializeNotifications: async () => 'granted', syncAllNotifications: async () => {} });
  const renderer = await h.mount(h.load('src/notifications/NotificationCoordinator.tsx').default, { navigationReady: true, navigationRef: { ...h.navigation, isReady: () => true } });
  t.after(async () => { await act(async () => renderer.unmount()); });
  assert.equal(h.navigationCalls.length, 0);
});
