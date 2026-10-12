# Repository guidance

## Expo and React Native

- This project uses Expo SDK 57. Before changing code, configuration, package versions, or native integrations, read the exact versioned documentation at <https://docs.expo.dev/versions/v57.0.0/>. Do not substitute the unversioned or latest documentation.
- Expo SDK 57 requires Node.js 22.13.x or newer. The project has been verified with Node 22.23.2; keep the documented runtime and lockfile in sync when changing dependencies.
- Use `npx expo install <package>` for Expo SDK packages and native React Native modules so the selected versions match this SDK. Keep `package-lock.json` committed with dependency changes.
- Native plugin, permission, or app configuration changes may require rebuilding the development client. See `README.md` for setup and platform instructions.

## Project conventions

- The app is an Expo / React Native project with TypeScript. Keep shared UI in `src/components`, screens in `src/screens`, navigation in `src/navigation`, and localized strings in `src/localization`.
- Add or update user-facing copy in both `src/localization/en.json` and `src/localization/ne.json`; use the existing `useTranslation` / i18next patterns instead of hard-coded screen text.
- Keep notification planning logic platform-independent where possible. Native delivery adapters are in `src/notifications/notificationAdapter.native.ts`; web intentionally uses a no-op adapter. Read the notification behavior and platform constraints in `README.md` before changing scheduling.
- Persistence is data-specific and some saved-data paths have known defects. Inspect the current storage and hydration code, related tests, and `docs/BUG_REPORT.md` before changing storage or documenting what survives an app restart. Do not imply account sync or server storage unless implementation changes.
- Check the current screen and navigation implementation before describing a feature as available; some profile and home actions remain placeholders or known display defects.

## Documentation and verification

- Keep `README.md` accurate for native development builds, standalone device installs, store builds, web development, and links to the detailed guides under `docs/`.
- The project test command is `npm test`. When asked to verify changes, run the relevant checks and report what was run and any limitations.
- Do not add generated native build output or secrets to the repository.
