# Architecture and storage

This describes the audited working tree on 2026-10-09, based on PR #38 plus the local pregnancy fixes. It describes implemented behaviour, including limitations.

## Entry and navigation

`index.ts` registers `App.tsx`. App loads fonts and hydrates the saved due date before mounting navigation. A due-date storage read failure shows a retry screen. A font-load error has no equivalent recovery path yet.

The app uses an explicit React Navigation container and stack/tab navigators imported through Expo Router's navigation helpers. Screen filenames such as `src/screens/article/[id].tsx` do not establish automatic file-based routes here: the screen is registered in `src/navigation/MainAppNavStack.tsx`.

- `AuthStak.tsx`: language → pregnancy setup → notification permission explanation → welcome. Sign-in and signup registrations are commented out.
- `MainAppBottomTabs.tsx`: Home, Planner, Meds and Library.
- Main stack: Profile, personal/medical information, Settings, Notifications, medication forms/history, articles and Danger Signs.
- Planner owns a nested stack for the schedule and visit checklist/detail views.
- `NotificationCoordinator.tsx` waits for navigation readiness and routes notification responses to medication details, the matching ANC checklist, or Library.

Saved EDD controls whether the main stack starts at Home or onboarding. This is pregnancy setup state, not authentication. Logout currently resets navigation without clearing the EDD or establishing a signed-out session.

## Providers and ownership

App mounts Redux, i18next, medication, personal-information, medical-history and tutorial providers around the navigators. Planner maintains its own saved state. Notification scheduling reads saved medication/Planner data rather than treating the Home preview as a source of truth.

| Owner | Source | Responsibilities |
| --- | --- | --- |
| Redux store | `src/store/store.ts` | Due date and display name. Only due date has durable storage. |
| Pregnancy helpers | `src/pregnancy/` | Valid calendar dates, EDD/LMP calculations, day refresh, formatting, weekly baby-size references and serialized EDD writes. |
| Medication provider | `src/context/MedicationContext.tsx` | CRUD, daily taken status, history, missed/overdue processing and notification resync. |
| Personal-information provider | `src/context/PersonalInformationContext.tsx` | Session-only personal form state. |
| Medical-history provider | `src/context/MedicalHistoryContext.tsx` | Session-only conditions and allergies. |
| Planner | `src/screens/planner/PlannerScreen.tsx` | Contact selection, completion, translated checklists, notes and appointments. |
| i18next | `src/localization/i18n.ts`, `en.json`, `ne.json` | English default, Nepali selection and English fallback; no language persistence. |
| Tutorial | `src/tutorial/` | Target measurement, geometry, overlay, step transitions, gate and replay. Completion/gate state is in memory. |
| Notification service | `src/notifications/` | Preference storage, planning, platform adapter, queue management and response routing. |

## Storage contract

Native storage uses AsyncStorage; web storage is scoped to the browser origin. This is local storage, without an implemented account, cloud synchronization, export/restore or app-level encryption layer. Do not assume records will survive uninstalling the app or clearing browser data.

| Data | Key / location | Current restart behaviour |
| --- | --- | --- |
| Due date | `mamacare:pregnancy-due-date:v1` | Calendar string `YYYY-MM-DD`, normalized on load. Writes are serialized and errors are surfaced. |
| Medications | `mamacare:medications` | JSON array; normally restored. A read error can overwrite existing records (BUG-04). |
| Adherence history | `mamacare_adherence_history` | JSON array; an ungated startup write can erase history before hydration (BUG-03). |
| ANC Planner | `mamacare:planner` | JSON state; restored in normal operation. Defaults include sample completion/appointment (BUG-06). Read failures are swallowed before defaults are written back. |
| Notification categories | `mamacare:notification-preferences` | ANC, medication and education booleans; stored and reloaded by the service. |
| Personal information | React state only | Lost when provider restarts (BUG-01). |
| Medical history | React state only | Lost when provider restarts (BUG-02). |
| Display name | Redux `userName` | Demo default; not synchronized with the personal form (BUG-15). |
| Language | i18next runtime | Returns to English after process restart (BUG-19). |
| Tour state | Tutorial gate/context | In memory; onboarding completion or explicit Settings replay marks it pending. |

Medication/Planner loaders cast parsed JSON instead of validating its schema. Storage failure recovery and migrations need a defined policy before these are reliable record stores. Never replace unread data with empty defaults as an error-recovery strategy.

## Pregnancy flow

1. Initial setup accepts EDD or derives EDD from LMP using 280 calendar days.
2. `saveDueDate` persists the normalized date before updating Redux.
3. Home and Profile calculate gestational weeks, trimester and days remaining from that date and the current local calendar day.
4. `usePregnancyProgress` refreshes on focus, day changes and foregrounding.
5. Baby size uses the completed week's reference for weeks 4–40; outside that range it has no matching weekly entry. These are typical reference sizes, not measurements of the user's baby. Source URLs live alongside each entry in `babySizes.ts`.

Date math uses calendar days to avoid DST/UTC off-by-one errors. The test fixture of EDD 2026-10-15 on local 2026-10-09 gives 39 weeks 1 day, third trimester, six days remaining. Out-of-range typed input still needs form-level validation (BUG-12).

## Medication and notification flow

The provider loads saved medications, normalizes taken status to the local day and writes updates. Foreground events and minute polling refresh daily/overdue status. Marking taken modifies today's record; other days' history should remain intact. These lifecycle paths are exercised using real React hooks and controlled storage/clock tests.

Saved medication/appointment/preferences changes trigger `syncAllNotifications`. The service reads the saved data, cancels owned pending notifications and rebuilds the nearest queue. `notificationAdapter.native.ts` wraps Expo notifications; `.web.ts` is a no-op adapter. The rolling queue has a maximum of 60 owned reminders. See [Notifications](NOTIFICATIONS.md) for timing and delivery limits.

Notification responses are processed both from live listeners and from the last response when the app launches. Responses without MamaCare's payload identifier are ignored. Automated tests verify routing and adapter contracts; delivery while locked/backgrounded requires a phone.

## Education and localization

The seven topics/articles and danger-sign data are bundled. Content tests check IDs, article sections in both languages, all eight ANC contact references, interpolation placeholders and supported icon families. They establish content structure, not clinical accuracy.

English fallback prevents many missing-key crashes, but can conceal incomplete Nepali translation. The audit found 28 missing keys and additional literal English strings. Planner currently stores translated checklist text instead of stable item IDs (BUG-07), so translation affects saved checklist identity.

## Test design

`tests/helpers/app-harness.mjs` transpiles and executes real application modules with real React hooks. Native primitives, device APIs, navigation, storage and graphics are replaceable boundaries. Scheduling/routing tests also execute their real modules; notification adapter tests replace Expo's OS API. See [Testing](TESTING.md) for what this can and cannot verify.
