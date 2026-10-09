import test from 'node:test';
import assert from 'node:assert/strict';
import { appHarness } from './helpers/app-harness.mjs';

function fixture(platform) {
  const h = appHarness({ platform });
  const calls = [];
  let permission = { granted: false, status: 'undetermined' };
  let requests = [];
  let response = null;
  const notifications = {
    AndroidImportance: { HIGH: 4, DEFAULT: 3 },
    IosAuthorizationStatus: { AUTHORIZED: 2, PROVISIONAL: 3, EPHEMERAL: 4, DENIED: 1, NOT_DETERMINED: 0 },
    SchedulableTriggerInputTypes: { DATE: 'date', WEEKLY: 'weekly' },
    setNotificationHandler: handler => calls.push(['handler', handler]),
    setNotificationChannelAsync: async (...args) => calls.push(['channel', ...args]),
    getPermissionsAsync: async () => permission,
    requestPermissionsAsync: async options => { calls.push(['permission', options]); return permission; },
    getAllScheduledNotificationsAsync: async () => requests,
    cancelScheduledNotificationAsync: async id => calls.push(['cancel', id]),
    getLastNotificationResponse: () => response,
    addNotificationResponseReceivedListener: callback => { calls.push(['listener', callback]); return { remove: () => calls.push(['remove']) }; },
    clearLastNotificationResponse: () => { response = null; },
    scheduleNotificationAsync: async value => { calls.push(['schedule', value]); return 'fixture-id'; },
  };
  h.mocks.set('expo-notifications', notifications);
  const adapter = h.load('src/notifications/notificationAdapter.native.ts');
  return { adapter, calls, notifications, setPermission: value => { permission = value; }, setRequests: value => { requests = value; }, setResponse: value => { response = value; } };
}
test('iOS authorized/provisional/ephemeral statuses normalize to granted', async () => {
  const f = fixture('ios');
  for (const status of [2, 3, 4]) { f.setPermission({ ios: { status } }); assert.equal(await f.adapter.getNotificationPermission(), 'granted'); }
  f.setPermission({ ios: { status: 1 } }); assert.equal(await f.adapter.getNotificationPermission(), 'denied');
  f.setPermission({ ios: { status: 0 } }); assert.equal(await f.adapter.getNotificationPermission(), 'undetermined');
});
test('Android channel setup precedes the permission request and uses correct priority', async () => {
  const f = fixture('android');
  f.setPermission({ granted: true, status: 'granted' });
  assert.equal(await f.adapter.requestNotificationPermission(), 'granted');
  const channels = f.calls.filter(call => call[0] === 'channel');
  assert.equal(channels.length, 2);
  assert.equal(channels[0][1], 'mamacare-important');
  assert.equal(channels[0][2].importance, 4);
  assert.equal(channels[1][2].importance, 3);
  assert.ok(f.calls.findIndex(call => call[0] === 'permission') > f.calls.findLastIndex(call => call[0] === 'channel'));
});
test('iOS does not create Android channels and Android normalizes denied permission', async () => {
  const ios = fixture('ios'); await ios.adapter.configureNotificationPlatform();
  assert.equal(ios.calls.some(call => call[0] === 'channel'), false);
  const android = fixture('android'); android.setPermission({ granted: false, status: 'denied' });
  assert.equal(await android.adapter.getNotificationPermission(), 'denied');
});
test('native pending reminders expose only MamaCare-owned requests', async () => {
  const f = fixture('ios');
  f.setRequests([{ identifier: 'owned', content: { data: { mamaCareReminder: true, kind: 'education' } } }, { identifier: 'unowned', content: { data: {} } }]);
  const pending = await f.adapter.getPendingReminders();
  assert.equal(pending.length, 1); assert.equal(pending[0].id, 'owned'); assert.equal(pending[0].title, 'MamaCare');
});
test('date and weekly schedule requests preserve trigger, channel, sound and data', async () => {
  const f = fixture('android');
  const data = { mamaCareReminder: true, kind: 'medication', sourceId: 'fixture' };
  await f.adapter.scheduleReminder({ title: 'Fixture', body: 'Fixture', channel: 'important', date: new Date(2026, 9, 10), data });
  const first = f.calls.find(call => call[0] === 'schedule')[1];
  assert.equal(first.trigger.type, 'date'); assert.equal(first.trigger.channelId, 'mamacare-important');
  assert.equal(first.content.data.sourceId, 'fixture'); assert.equal(first.content.sound, 'default');
  await f.adapter.scheduleReminder({ title: 'Fixture', body: 'Fixture', channel: 'education', weekly: { weekday: 7, hour: 10, minute: 0 }, data: { ...data, kind: 'education' } });
  const second = f.calls.filter(call => call[0] === 'schedule')[1][1];
  assert.equal(second.trigger.type, 'weekly'); assert.equal(second.trigger.weekday, 7); assert.equal(second.trigger.channelId, 'mamacare-education');
  await assert.rejects(f.adapter.scheduleReminder({ title: '', body: '', data, channel: 'important' }), /requires a date or weekly schedule/);
});
test('native response mapping, cancellation and listener cleanup work', async () => {
  const f = fixture('ios');
  const response = { notification: { request: { identifier: 'fixture', content: { data: { mamaCareReminder: true, kind: 'education' } } } } };
  f.setResponse(response);
  assert.equal(f.adapter.getLastReminderResponse().id, 'fixture');
  let received;
  const unsubscribe = f.adapter.addReminderResponseListener(value => { received = value; });
  f.calls.find(call => call[0] === 'listener')[1](response);
  assert.equal(received.data.kind, 'education');
  unsubscribe(); assert.ok(f.calls.some(call => call[0] === 'remove'));
  f.adapter.clearLastReminderResponse(); assert.equal(f.adapter.getLastReminderResponse(), null);
  await f.adapter.cancelReminder('fixture'); assert.ok(f.calls.some(call => call[0] === 'cancel' && call[1] === 'fixture'));
});
test('foreground notifications use banners, list and sound, without setting badge', async () => {
  const f = fixture('ios');
  const policy = await f.calls[0][1].handleNotification();
  assert.equal(policy.shouldShowBanner, true); assert.equal(policy.shouldShowList, true); assert.equal(policy.shouldPlaySound, true); assert.equal(policy.shouldSetBadge, false);
});
