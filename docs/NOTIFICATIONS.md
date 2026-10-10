# Local notifications

## Notification decisions for issue #29

| Reminder | Timing | Delivery behaviour |
| --- | --- | --- |
| ANC appointment | 7 days, 24 hours, and 1 hour before the appointment | Past reminder times are skipped. Completing the visit cancels its remaining reminders. |
| Medication | Exactly at the medication's scheduled time | Valid 12-hour times such as `8:00 AM` are required. Occurrences are prepared up to 30 days ahead, with the nearest reminders filling the available device-safe queue. Opening the app, editing the medication, or changing its status refreshes this buffer. |
| Pregnancy education | Every Saturday at 10:00 AM local time | A friendly weekly reminder with normal priority. |

Medication reminders use separate one-off occurrences rather than one repeating alarm. This lets MamaCare cancel today's occurrence when a medication is marked as taken without cancelling tomorrow's reminder. A medication marked as taken is reset for the new local day.

MamaCare keeps at most 60 owned reminders pending because iOS retains only a limited number of pending local notifications per app. ANC and the repeating weekly education reminder are scheduled first, then the nearest medication occurrences across all medications fill the remaining slots in chronological order. Any later medication occurrences are deferred rather than deleted from the user's medication data.

The medication schedule is therefore a rolling nearest-reminder queue, not a guaranteed 30-day buffer. Thirty days is the maximum planning horizon for each medication, but the actual time covered becomes shorter when a user has multiple daily medications or many upcoming ANC reminders. The queue is rebuilt whenever MamaCare becomes active or medication, appointment, language, or reminder settings change. A delivered notification does not by itself reopen MamaCare or refill the queue, so a user who does not open the app again may eventually exhaust the scheduled reminders. The Notifications screen shows the current pending-reminder count.

### Changes to underlying data

- Editing an appointment or medication cancels its old pending reminders and schedules replacements. The user experiences this as an update; no obsolete alert remains.
- Deleting a medication cancels all its pending reminders.
- Marking a medication as taken before its time cancels today's occurrence only. Unmarking it before the scheduled time restores today's reminder.
- Completing an ANC visit cancels the visit's remaining reminders. Marking it incomplete schedules any offsets that are still in the future.
- Changing the app language rebuilds all pending ANC, medication, and education reminders using the new language. A notification that has already been delivered cannot be rewritten.
- Turning off a reminder category cancels its pending notifications. Turning it back on rebuilds them from saved app data.
- Tapping a medication reminder opens that medication's details. Tapping an ANC reminder opens that visit's checklist, and tapping the weekly education reminder opens the Library. This works when MamaCare is already running and when a notification launches the app.

### Permissions and platform configuration

MamaCare first shows an onboarding explanation after pregnancy date setup. The native permission prompt appears only after the user taps **Allow Notifications**. Choosing **Not now** does not block onboarding, and permission can be enabled later under **Profile → Notifications**. iOS and Android only show their native permission dialog while permission is still undetermined; after a denial, MamaCare explains this and offers to open the device settings instead of silently continuing. Android notification channels are created before the permission request.

Android declares `SCHEDULE_EXACT_ALARM` so scheduled medication and ANC times can be exact on Android 12 and newer when the device grants the app **Alarms & reminders** access. On most fresh Android 14-and-newer installs this special access is off by default. Expo falls back to an inexact alarm when access is unavailable, so a reminder remains scheduled but Android may deliver it later than the requested minute. This permission is separate from the normal notification prompt and should be checked during Android release testing. The `expo-notifications` config plugin is included in `app.json`; native configuration changes require rebuilding the native development app to take full effect.

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
- the available queue slots are filled by the nearest medication occurrences across all medications;
- ANC reminders are exactly 7 days, 24 hours, and 1 hour early;
- expired ANC offsets and invalid placeholder dates are ignored;
- medication, ANC, and education notification payloads select the correct destination.

### 2. Medication lifecycle test

1. Add a medication whose time is a few minutes in the future.
2. Return to **Profile → Notifications** and confirm the pending-reminder count increases.
3. Lock the phone or put MamaCare in the background and confirm the notification arrives at the entered time.
4. Tap the delivered notification and confirm MamaCare opens that medication's details.
5. Edit the medication to another near-future time and confirm it arrives at the new time rather than the old one.
6. Mark it as taken before the new time and confirm today's notification does not arrive.
7. Delete the medication and confirm the pending-reminder count decreases.

### 3. ANC lifecycle test

1. Open Planner and give an incomplete ANC visit a real future appointment date and time.
2. Open **Profile → Notifications** and confirm its reminders are included in the pending count.
3. Tap a delivered ANC notification and confirm MamaCare opens the matching visit checklist.
4. Change the appointment time and confirm the pending count remains consistent.
5. Mark the visit complete and confirm the pending count decreases for any remaining reminders.

For a visible delivery without waiting seven days, set an appointment to 7 days and a few minutes from now. Its seven-day reminder will then fire in a few minutes.

### 4. Language and preference test

1. Ensure at least one real medication or ANC reminder is pending.
2. Change the app language from Profile.
3. Turn each reminder category off and confirm the pending count decreases.
4. Turn it on and confirm the current reminders are rebuilt.

### 5. Denied-permission test

1. Disable MamaCare notifications in the phone's system settings.
2. Return to **Profile → Notifications**.
3. Confirm the screen reports that notifications are blocked.
4. Tap **Enable**, re-enable notifications in device settings, and return to MamaCare.
5. Schedule a near-future medication reminder and confirm it is delivered.

For final Android validation, use a rebuilt development or release app rather than relying only on Expo Go, because exact-alarm permission and notification channel configuration are native build settings.

On Android 14 or newer, repeat the medication delivery test once with **Settings → Apps → Special app access → Alarms & reminders → MamaCare** disabled and once with it enabled. The disabled case verifies that a reminder is still scheduled using Android's inexact fallback; the enabled case verifies exact-minute delivery.
