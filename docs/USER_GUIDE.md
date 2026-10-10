# Using the current MamaCare app

## Pregnancy setup and due date

On a fresh installation, select English or Nepali, then enter an estimated due date (EDD) or the first day of the last menstrual period (LMP). Continue through the notification explanation and welcome screen.

Home shows weeks/days, trimester and days remaining from the saved EDD. Open the profile icon at the top for the EDD card and weekly baby-size reference. Edit the EDD there and save; Home and Profile should update together. The size is a typical weekly reference rather than a personal measurement.

## Where features are

| Location | Actions |
| --- | --- |
| Home tab | Pregnancy summary, medication checkboxes, ANC preview and symptom-tracking placeholder |
| Planner tab | Open an ANC contact; check items, add notes, change appointment date/time/facility and mark complete |
| Meds tab | Add medication, open details to edit, mark/unmark taken, and view adherence history |
| Library tab | Search/filter topics, read articles, and open Danger Signs with contact-specific sections |
| Top profile icon | Personal Information, Medical History, EDD/baby size, language, Notifications and placeholder support/contact tools |
| Top bell icon | Permission status, reminder categories and pending-reminder count |
| Top settings icon | Language selection and replay of the guided tour |

**There are no active sign-in or create-account buttons.** Those routes are disabled and no account/backend is wired. Logout returns to onboarding navigation; it does not currently establish a persistent signed-out session. Help/support, emergency contacts and symptom tracking are coming soon.

## How to check persistence

Use invented test entries, and test each data type separately:

1. Change the EDD or add a medication/Planner appointment. Save it and leave the screen.
2. Return to that screen first. This checks only the current session.
3. Fully close the app and reopen it. On web, reload the page. Stop/restart the development server only if also testing connectivity; that alone does not restart app state on a connected phone.
4. Check the exact date, medication time/taken status, appointment facility, notes and checkboxes.
5. Test delayed/error cases using `npm run test:known-bugs`; repeatedly reopening normally may not expose a timing-dependent data loss bug.

The audit found that personal information and medical history disappear at restart, language returns to English, and medication history can be lost during startup. A “Saved” message on those profile forms currently confirms only an in-session update. EDD has durable storage; normal medication and Planner reloads passed, with the failure cases documented in the [bug report](BUG_REPORT.md).

## Reminder expectations

Allow notifications from the app's permission explanation or Notifications screen. On a phone, a denied permission must be changed in system settings. Medication reminders use the entered time; ANC reminders use the saved real appointment date/time. Invalid sample dates do not schedule reminders.

Reminders are local to that phone. They do not require a MamaCare server once scheduled, but the rolling medication queue is finite and needs the app to reopen to refill it. Browser notifications are unsupported. See [Notifications](NOTIFICATIONS.md) for exact timing and platform limits.

## Development connection problems

For “Could not connect to development server,” keep Expo running in `~/Code/mama-care`, use the current server link and check that the phone can reach the computer on the same network. If local Wi-Fi isolates devices, restart with `npm start -- --dev-client --tunnel`. The installed MamaCare development client is needed for its custom QR link.

Development server connectivity and saved-record persistence are separate: losing the server connection stops loading the app code; losing a stored record is an application bug. A saved old server URL should not be used to judge persistence.

## Known display issues

Home's ANC card still shows a fixed 14 days and a sample hospital regardless of Planner. New Planner users start on contact 1 with no visits marked complete; previously saved completions are preserved. The sample appointment in Planner remains a known issue. An empty medication list offers Add New Medication. Home keeps each medication visible: tap its checkbox to mark today's dose taken, or tap the checked box again to undo it. The all-taken message appears only when every medication is checked.
