# MamaCare

MamaCare is an Expo/React Native pregnancy support app. Its reminders are local notifications: the phone stores and delivers them, so reminder delivery does not require an internet connection or a MamaCare server.

## Development setup

Expo SDK 57 requires Node.js 22.13 or newer. This project has been verified with Node 22.23.2.

```bash
nvm use 22.23.2
npm ci
npm test
npm start
```

The web build remains supported, but notifications are intentionally a no-op on web. Test reminder delivery on iOS or Android.

## Notification decisions for issue #29

| Reminder | Timing | Delivery behaviour |
| --- | --- | --- |
| ANC appointment | 7 days, 24 hours, and 1 hour before the appointment | Past reminder times are skipped. Completing the visit cancels its remaining reminders. |
| Medication | Exactly at the medication's scheduled time | Each medication is prepared up to 30 days ahead. Opening the app, editing the medication, or changing its status refreshes this buffer. |
| Pregnancy education | Every Saturday at 10:00 AM local time | A friendly weekly reminder with normal priority. |
| Developer test | 5 seconds after tapping a test button | Development builds only; available for medication, ANC, and education. |

Medication reminders use separate one-off occurrences rather than one repeating alarm. This lets MamaCare cancel today's occurrence when a medication is marked as taken without cancelling tomorrow's reminder. A medication marked as taken is reset for the new local day. If the app is not opened for more than 30 days, the medication buffer can run out; it is refilled whenever the app becomes active.

The phone may impose its own limit on the number of pending local notifications. MamaCare always rebuilds its owned reminders from current app data, and the developer screen shows what the operating system currently has pending.

### Changes to underlying data

- Editing an appointment or medication cancels its old pending reminders and schedules replacements. The user experiences this as an update; no obsolete alert remains.
- Deleting a medication cancels all its pending reminders.
- Marking a medication as taken before its time cancels today's occurrence only. Unmarking it before the scheduled time restores today's reminder.
- Completing an ANC visit cancels the visit's remaining reminders. Marking it incomplete schedules any offsets that are still in the future.
- Changing the app language rebuilds all pending ANC, medication, and education reminders using the new language. A notification that has already been delivered cannot be rewritten.
- Turning off a reminder category cancels its pending notifications. Turning it back on rebuilds them from saved app data.

### Permissions and platform configuration

MamaCare creates Android notification channels before asking for permission, requests notification permission on first native launch, and exposes the current permission status under **Profile → Notifications**. If permission was denied, the Enable button opens the device settings.

Android declares `SCHEDULE_EXACT_ALARM` so scheduled medication and ANC times can be exact on Android 12 and newer. The `expo-notifications` config plugin is included in `app.json`; native configuration changes require rebuilding the native development app to take full effect.

## Testing notifications

### 1. Automated scheduling checks

Run:

```bash
npm test
```

These tests use a fixed clock and verify:

- 12-hour medication times are parsed correctly;
- a due medication produces a 30-day schedule;
- marking it taken removes today but preserves future occurrences;
- ANC reminders are exactly 7 days, 24 hours, and 1 hour early;
- expired ANC offsets and invalid placeholder dates are ignored.

### 2. Five-second delivery smoke test

Use a physical phone for the most reliable result.

1. Start the app in development mode and allow notifications when prompted.
2. Open **Profile → Notifications**.
3. Confirm **Device permission** says notifications are enabled.
4. Under **Developer testing**, tap **Test medication**.
5. Immediately lock the phone or put MamaCare in the background.
6. Confirm the notification appears about 5 seconds later. It should play a sound unless the phone's silent or focus settings suppress it.
7. Repeat for **Test ANC** and **Test education**.
8. Repeat one test after enabling airplane mode. It should still arrive.

The Developer testing section is guarded by `__DEV__` and is not included in a production interface.

### 3. Medication lifecycle test

1. Add a medication whose time is a few minutes in the future.
2. Return to **Profile → Notifications**, tap **Refresh list**, and confirm its pending occurrences appear.
3. Edit its time and refresh the list. Confirm the old time is gone and the new time is present.
4. Mark it as taken before the new time. Refresh and confirm today's occurrence is gone while future dates remain.
5. Unmark it before the scheduled time. Refresh and confirm today's occurrence returns.
6. Delete the medication. Refresh and confirm all reminders for it are gone.

### 4. ANC lifecycle test

1. Open Planner and give an incomplete ANC visit a real future appointment date and time.
2. Open **Profile → Notifications** and refresh the pending list.
3. Confirm up to three reminders exist at 7 days, 24 hours, and 1 hour before the appointment. An offset already in the past should not exist.
4. Change the appointment time and confirm the old reminders are replaced.
5. Mark the visit complete and confirm its remaining reminders disappear.

For a visible delivery without waiting seven days, set an appointment to 7 days and a few minutes from now. Its seven-day reminder will then fire in a few minutes. The five-second ANC test is the faster general delivery check.

### 5. Language and preference test

1. Ensure at least one real medication or ANC reminder is pending.
2. Change the app language from Profile.
3. Return to Notifications and confirm the pending reminder titles and bodies use the new language.
4. Turn each reminder category off and confirm its pending items disappear.
5. Turn it on and confirm the current reminders are rebuilt.

### 6. Denied-permission test

1. Disable MamaCare notifications in the phone's system settings.
2. Return to **Profile → Notifications**.
3. Confirm the screen reports that notifications are blocked.
4. Tap **Enable**, re-enable notifications in device settings, and return to MamaCare.
5. Run a five-second test again.

For final Android validation, use a rebuilt development or release app rather than relying only on Expo Go, because exact-alarm permission and notification channel configuration are native build settings.
