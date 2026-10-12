# AGENTS.md

## Project Overview

MamaCare is a React Native mobile application built with Expo and TypeScript.

The application supports maternal health features including:

- Pregnancy progress tracking
- ANC visit planning and appointment tracking
- Medication and supplement tracking
- Medication adherence history
- Medical history
- Emergency contacts
- Educational resources
- English and Nepali localisation
- Local notifications and reminders

The project is intended to run primarily as a mobile application.

## Core Technology

The current project uses:

- Expo SDK 57
- React Native 0.86.3
- React 19.2.3
- TypeScript 6.0.3
- React Navigation
- Expo Router
- Redux Toolkit
- Redux Persist
- AsyncStorage
- React Context
- i18next / react-i18next
- Expo Notifications

Use the versions already defined in `package.json`.

Do not upgrade Expo, React Native, React, TypeScript, navigation packages, or other major dependencies unless the task explicitly requires it.

## Expo Version

Expo has changed significantly between versions.

Before changing Expo-related configuration, native dependencies, notifications, routing, build settings, or Expo APIs, read the exact Expo SDK 57 documentation:

https://docs.expo.dev/versions/v57.0.0/

Do not rely on instructions written for older Expo versions.

## Node and Package Manager

This project uses npm and includes `package-lock.json`.

Supported Node versions are defined in `package.json`:

```text
^22.13.0 || >=24.3.0
```

Install dependencies with:

```bash
npm install
```

Do not switch package managers or regenerate the dependency lockfile unless necessary.

## Development Commands

Start the standard Expo development server:

```bash
npm start
```

Equivalent command:

```bash
npx expo start
```

Start Android through Expo:

```bash
npm run android
```

Start iOS through Expo:

```bash
npm run ios
```

Start the web version:

```bash
npm run web
```

For the Android development client:

```bash
npx expo start --dev-client -c
```

To build and install the Android app locally:

```bash
npx expo run:android
```

For Expo Go testing:

```bash
npx expo start --go -c
```

Use the `-c` option when Metro or Expo cache problems are suspected.

## Project Checks

The repository contains project-specific scripts.

Run the normal test suite with:

```bash
npm test
```

Run tests for known-bug scenarios with:

```bash
npm run test:known-bugs
```

Run timezone-related tests with:

```bash
npm run test:timezones
```

Run the TypeScript compiler check with:

```bash
npm run typecheck
```

Run the build validation script with:

```bash
npm run build:check
```

Run the combined project checks with:

```bash
npm run check
```

When a check fails, determine whether the failure was introduced by the current change before modifying unrelated code.

Do not fix unrelated existing problems as part of a focused task unless explicitly asked.

## Project Structure

Important files and directories include:

- `App.tsx` - top-level application component
- `index.ts` - application entry point
- `app.json` - Expo application configuration
- `eas.json` - EAS build configuration
- `src/components` - reusable UI components
- `src/context` - React context providers and context-managed state
- `src/navigation` - navigation stacks and screen registration
- `src/screens` - application screens
- `src/store` - Redux state, reducers, and persistence configuration
- `src/notifications` - notification scheduling and reminder logic
- `src/pregnancy` - pregnancy progress and due-date logic
- `src/localization` - localisation configuration and translation files
- `scripts` - repository-specific validation and test scripts
- `tests` - project tests
- `assets` - icons, splash images, fonts, and other bundled assets
- `docs` - project documentation
- `android` - generated/native Android project

Before adding new files, check whether there is already an appropriate location or existing pattern.

## Application Configuration

Important Expo configuration is stored in `app.json`.

Current Android package:

```text
com.mamacareteamcits3200.mamaCare
```

Current iOS bundle identifier:

```text
mamaCare
```

The EAS project is already configured through `app.json`.

Do not change the Android package name, iOS bundle identifier, EAS project ID, app slug, application identity, or signing/build configuration unless explicitly requested.

The application is currently configured for portrait orientation and light mode.

## EAS Builds

EAS configuration is stored in `eas.json`.

Available build profiles are:

- `development` - internal development client
- `preview` - internal distribution
- `production` - production build with automatic version incrementing

For an installable internal Android build, the `preview` profile is the relevant EAS profile unless the release requirements specify otherwise.

Example:

```bash
eas build --platform android --profile preview
```

For final release work:

1. Ensure all intended changes have been merged.
2. Build from the final intended branch, normally `main`.
3. Pull the latest changes before building.
4. Run relevant tests and checks.
5. Create the installable build.
6. Install and smoke-test the generated build.
7. Confirm the tested build matches the source code being delivered.

Do not create a final client build from an outdated feature branch.

## Native Android Code

The repository contains an `android` directory because native Android builds have been generated.

Prefer Expo configuration, Expo plugins, and normal React Native code where possible.

Do not manually modify generated native Android files unless the task specifically requires a native change.

Changes to native dependencies or Expo plugins may require rebuilding the development client with:

```bash
npx expo run:android
```

Restarting Metro alone is not sufficient when native dependencies have changed.

## State and Persistence

MamaCare uses multiple forms of state management.

These include:

- Redux Toolkit
- Redux Persist
- AsyncStorage
- React Context

Do not assume Redux is the only source of application state.

Redux persistence is configured under:

```text
src/store
```

AsyncStorage is also used directly by several features.

Known persisted application data includes:

- medications
- medication adherence history
- ANC planner data
- pregnancy due date
- emergency contacts
- notification preferences
- persisted Redux user data

Medical history is currently stored in React Context state rather than AsyncStorage.

When changing logout, account reset, onboarding, persistence, or user switching behaviour, check all relevant state stores.

## Logout and User Reset Behaviour

Logout is expected to remove the current user's local application data before returning to the authentication flow.

Relevant state may exist in:

- Redux / Redux Persist
- AsyncStorage
- Medication Context
- Medical History Context
- Planner storage
- Pregnancy due-date storage
- Emergency Contacts storage

Do not implement logout by only navigating back to the authentication screen.

When changing logout behaviour, verify that previously entered user information does not remain visible after a new session begins.

Also synchronise notifications after relevant persisted reminder data has been removed.

## Pregnancy and Due-Date State

Pregnancy due-date storage is implemented in:

```text
src/pregnancy/storage.ts
```

The storage key is:

```text
mamacare:pregnancy-due-date:v1
```

Pregnancy progress logic is located under:

```text
src/pregnancy
```

Reuse existing pregnancy helpers rather than independently reimplementing date or gestation calculations.

Be careful with date parsing and local-date behaviour.

## ANC Planner

ANC planner information is persisted separately from Redux.

Planner-related persistence uses:

```text
mamacare:planner
```

Planner changes may affect:

- scheduled ANC appointments
- completed ANC visits
- Home screen information
- ANC notifications

When modifying planner data, consider all of these consumers.

## Medication Logic

Medication state is managed primarily through:

```text
src/context/MedicationContext.tsx
```

Medication data and medication adherence history are related but distinct.

A medication's current object may contain fields such as:

- `taken`
- `missed`
- `statusDate`

The application also stores adherence records separately.

The medication screen uses adherence history when determining displayed status.

Therefore, changing only the `missed` or `taken` field on the medication object may not be sufficient.

For example, when an already-overdue medication is added, the application should keep both representations consistent:

```text
medication.missed = true
```

and a corresponding adherence record should use:

```text
status = "missed"
```

When changing medication behaviour, check:

- medication state
- adherence history
- selected-date behaviour
- current-day behaviour
- persisted medication data
- notifications

Do not create parallel medication-status logic when an existing helper already handles the calculation.

## Dates and Times

Medication and planner behaviour depend on local dates and times.

Use the existing helpers such as `localDateKey` and existing medication-time parsing logic.

Do not replace local-date handling with UTC-based date strings without checking the effect on:

- today's medication status
- adherence history
- scheduled reminders
- planner dates
- timezone tests

Run:

```bash
npm run test:timezones
```

when changing date-sensitive logic.

## Notifications

Notification behaviour is primarily implemented under:

```text
src/notifications
```

The main notification service is:

```text
src/notifications/notificationService.ts
```

The notification system handles:

- ANC reminders
- medication reminders
- education reminders
- notification preferences

Important persisted keys include:

```text
mamacare:notification-preferences
mamacare:medications
mamacare:planner
```

The Android app requests:

```text
android.permission.SCHEDULE_EXACT_ALARM
```

Expo Notifications is configured in `app.json`.

Before changing notification behaviour, check the existing notification service, planning helpers, and notification adapter.

Do not schedule duplicate notifications.

When medication or planner data changes substantially, consider whether reminders need to be synchronised again.

## Localisation

MamaCare supports English and Nepali.

Translation files are:

```text
src/localization/en.json
src/localization/ne.json
```

User-facing text should normally use the translation system instead of hard-coded English strings.

When adding or changing user-facing text:

1. Add or update the English translation.
2. Add or update the corresponding Nepali translation.
3. Use `t(...)` in the component.
4. Check both languages where practical.

Do not remove existing Nepali translations while changing unrelated text.

Be careful when editing translation JSON files because malformed JSON will prevent localisation from loading.

## Navigation

Navigation is primarily configured under:

```text
src/navigation
```

The main application navigation stack includes:

```text
src/navigation/MainAppNavStack.tsx
```

Check the existing navigation pattern before adding a new route or screen.

Some screens intentionally hide the native stack header and render their own application header or back navigation.

Do not add a native header without checking whether the screen already implements a custom header.

After navigation changes, test:

- forward navigation
- back navigation
- tab navigation
- logout navigation
- Android behaviour
- iOS behaviour where available

## Styling and UI

Follow existing MamaCare components, fonts, spacing utilities, and colour constants where possible.

Important shared styling resources include:

```text
src/styles
```

The project uses utilities including:

- `react-native-size-matters`
- shared `AppColors`
- shared `AppFonts`
- reusable application components

Reuse existing components instead of introducing visually inconsistent replacements.

Avoid unnecessary UI redesign while fixing functional bugs.

## Images and Media

The application uses Expo Image and Expo Image Picker.

Adding or changing native media functionality may require a development-client rebuild.

Assets used by Expo configuration are stored under:

```text
assets
```

Do not rename or remove configured icon, splash, adaptive icon, or favicon assets without updating `app.json`.

## Coding Guidelines

When modifying this repository:

- Use TypeScript.
- Follow the existing file structure.
- Follow the existing formatting style in the file being edited.
- Prefer small, targeted changes.
- Avoid unrelated refactors.
- Reuse existing helpers.
- Reuse existing components.
- Reuse existing context or Redux state where appropriate.
- Do not duplicate existing business logic.
- Do not introduce new dependencies unless necessary.
- Preserve English and Nepali support.
- Preserve existing notification behaviour unless intentionally changing it.
- Preserve existing persisted user data unless the task concerns resetting or migrating it.
- Keep Android and iOS behaviour in mind.
- Check callers before changing shared functions or types.

## Dependency Changes

Before adding a package:

1. Check whether the project already has a dependency that provides the required functionality.
2. Confirm that the package supports Expo SDK 57 and React Native 0.86.
3. Prefer Expo-supported packages when appropriate.
4. Determine whether the package contains native code.
5. If native code is added, rebuild the development client.

Do not casually upgrade multiple dependencies while fixing an unrelated problem.

## Before Committing

Before committing a change:

1. Test the affected feature.
2. Check the relevant screen manually.
3. Run appropriate automated checks.
4. Check navigation if routes or screens changed.
5. Check persistence if stored data changed.
6. Check notification behaviour if planner or medication logic changed.
7. Check both English and Nepali if user-facing text changed.
8. Review `git diff`.
9. Review `git status`.
10. Confirm only intended files changed.

Useful commands:

```bash
git diff
git status
npm test
npm run typecheck
npm run build:check
```

Run additional checks when relevant.

## Git Practices

Keep commits focused on one logical change where practical.

Examples:

- logout/reset fix
- medication behaviour fix
- documentation update

Do not mix unrelated code changes into the same commit merely because they were made during the same session.

Before pushing:

```bash
git status
```

Confirm the working tree is clean and that the intended commits are present.

## Final Release Checklist

Before producing a client-facing final build:

1. Confirm all approved changes are merged.
2. Switch to the final release branch, normally `main`.
3. Pull the latest remote changes.
4. Confirm the working tree is clean.
5. Install dependencies if required.
6. Run relevant tests and project checks.
7. Build the intended release or internal distribution version.
8. Install the generated app.
9. Smoke-test major flows.
10. Confirm the build corresponds to the source code being delivered.
11. Provide the final source code and installable build required by the project deliverables.

Important smoke-test areas include:

- onboarding/authentication
- profile
- pregnancy progress
- ANC planner
- medications
- adherence history
- medical history
- emergency contacts
- Library content
- English/Nepali language behaviour
- notifications
- logout/reset behaviour

## General Rule for Agents

Before making a change, inspect the existing implementation first.

Do not assume how a feature works from its screen name alone.

MamaCare has state shared across Redux, Context, AsyncStorage, navigation, and notification services, so changes in one area may affect another.

Prefer understanding and extending the existing implementation over replacing it.