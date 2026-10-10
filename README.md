# MamaCare

MamaCare is a pregnancy support app built with Expo SDK 57, React Native and TypeScript. It includes pregnancy progress, a local medication tracker, an antenatal care (ANC) planner, an education library and English/Nepali content.

**Current status: development prototype.** The October 2026 audit found data loss and inaccurate appointment displays. Read the [bug report](docs/BUG_REPORT.md) before relying on saved records. Accounts, cloud backup and clinical validation are not implemented.

## Start developing

Use the repository in the Code folder:

```bash
cd ~/Code/mama-care
nvm install
nvm use
npm ci
npm start
```

`.nvmrc` pins Node 22.23.2. The [versioned Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) specifies Node 22.13.x minimum; the package engine range also follows the supported Node 24 minimum. Read those docs when changing Expo code or native configuration.

### Open on a phone

This project includes `expo-dev-client`, so Expo normally starts in **development build** mode. Install the matching MamaCare development build on the phone, keep the computer and phone on the same network, and open the current development link. A previously saved server address may become stale when the computer's IP address changes.

If the phone cannot reach the computer over Wi-Fi, stop the existing server and use:

```bash
npm start -- --dev-client --tunnel
```

A tunnel forwards the development connection through a public relay. It can get around local network isolation, requires internet access and can be slower. It does not publish a standalone app, save records to the cloud, or replace the installed development build. Expo may prompt to install its tunnel helper.

The development QR contains a custom `exp+mamacare://` link. If the camera reports no useful data, open the installed development app's launcher and use its scanner or enter the displayed server URL. Use the **current** link rather than a saved old connection. Pressing `s` switches Expo's launch target to Expo Go; use the development build for native reminder testing.

The `xcrun simctl` warning concerns the Mac's simulator setup. The server may still run for a physical phone. Simulator testing requires the Xcode setup specified in the versioned Expo docs.

### Open in a browser

```bash
npm run web
```

Web is useful for screen checks. Local notifications are deliberately unsupported there; the permission screen currently presents this poorly (BUG-20). Personal Information's birth date picker also does not work on web (BUG-18).

## What is implemented

| Area | Current behaviour |
| --- | --- |
| Pregnancy | EDD/LMP setup, saved due date, calendar-based weeks/days, trimester, countdown and weekly baby size. Home and Profile use the shared calculation. |
| Medications | Add/edit/remove, daily taken status, history, overdue status and local storage. Loading failures and history hydration have known data loss defects. |
| ANC Planner | Eight contacts, checklists, notes, appointment editing and completion. New-user defaults contain sample clinical records; Home does not reflect appointments. |
| Education | Seven articles, topic search/filtering, general danger signs and danger signs for all eight ANC contacts. |
| Notifications | Native local reminders, permission onboarding, category settings, queue rebuilding and notification tap routing. Actual phone delivery still needs device QA. |
| Profile | EDD editing and personal/medical forms. Personal information and medical history currently last only for the running session. |
| Language and tour | English/Nepali selection and a five-step tour with replay. Language does not survive restart; Nepali settings/tour translations are incomplete. |
| Accounts and other tools | Sign-in/signup routes are disabled. Symptom tracking, emergency contacts and help/support show coming-soon messages. Profile picture editing is not wired. |

## Run checks

```bash
npm test                 # passing checks plus explicitly labelled known-defect TODO tests
npm run test:known-bugs   # strict reproductions; currently exits with failure
npm run test:timezones    # date/reminder checks in four time zones
npm run typecheck        # currently fails on two inactive signup errors
npm run build:check      # exports iOS, Android and web to a temporary directory
npm run check            # tests, type check and bundles; runs all three even if one fails
```

Audit baseline: **105 passing tests, 14 known-defect TODO tests, zero unexpected test failures**. The 14 TODO assertions actually reproduce bugs; they are not skipped or counted as passes. The strict command reports all 14 as failures. Four time-zone runs pass, and all three platforms bundle. `npm run check` still exits with failure because of the signup type errors. These checks do not establish native notification delivery or release readiness.

## Documentation

- [User guide](docs/USER_GUIDE.md): where features are and how to check persistence.
- [Architecture and storage](docs/ARCHITECTURE.md): navigation, providers, stored data and data flows.
- [Testing guide](docs/TESTING.md): runnable commands, coverage, mocks and the device QA checklist.
- [Ownership review](docs/OWNERSHIP_REVIEW.md): selected fixes and teammate scopes reserved.
- [Bug report](docs/BUG_REPORT.md): findings, reproduction steps, priorities and evidence.
- [Notification design and device checks](docs/NOTIFICATIONS.md): scheduling rules, limitations and native permissions.

## Working on a bug

Use the existing branch or create a descriptive branch for new work. Keep local changes before pulling or switching branches. Reproduce the matching BUG test in strict mode, make the fix, and convert its `knownBug(...)` test to an ordinary `test(...)` once it passes. Add coverage for the fix's boundaries and update the report's status. See [Testing](docs/TESTING.md) for individual-file commands.
