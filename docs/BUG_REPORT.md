# MamaCare application audit — 2026-10-09

## Scope and baseline

- Repository: `/Users/rileypigneguy/Code/mama-care`.
- Branch: `fix-pregnancy-details`; baseline HEAD `445a9ae`, merge of PR #38.
- Audited the existing local pregnancy/UI fixes as well as the rest of the current working tree. These local changes are not all part of PR #38.
- Expo SDK 57, React 19.2.3, React Native 0.86.3; checks run with Node 22.23.2.
- Automated test clock: local 2026-10-09 noon unless a case supplies another time. Browser audit: exported web app served on localhost, synthetic data, including a 390 × 844 viewport.
- Reviewed startup/navigation, pregnancy, medications/history, Planner, profile, language, Library/Danger Signs, tutorial, notifications, persistence and dependency findings.

This report contains **23 findings**: 17 application defects with automated reproductions, four additional browser/source findings, one inactive-screen type-check failure and one dependency-security triage finding. Priorities reflect potential impact; they are not clinical risk assessments. **BUG-09, BUG-10, BUG-11 and BUG-17 are fixed locally. The critical subfinding of BUG-23 is remediated; its other dependency findings remain open.** Original reproduction descriptions are retained below, with current fix status recorded at each repaired finding.

## Selected fixes and ownership

The five fixes were selected after reviewing live issues, assignees, comments and PR #22. State management/persistence, localization, profile/settings/notifications, emergency contacts and intro implementation were reserved for their assigned owners. See [Ownership review](OWNERSHIP_REVIEW.md) for the scope mapping and reasons for selecting BUG-09/10/11/17 and the critical part of BUG-23. These fixes are local and not yet merged.

## How to run the tests

```bash
npm test
npm run test:known-bugs
npm run test:timezones
npm run typecheck
npm run build:check
npm run check
```

- `npm test`: runs the full suite. Known-defect assertions run as TODOs; unexpected failures still fail the command.
- `npm run test:known-bugs`: reproduces the documented bugs as ordinary failing tests. It currently exits with failure for all 14 remaining assertions.
- `npm run test:timezones`: repeats date and reminder checks in four time zones.
- `npm run typecheck`: checks TypeScript; currently fails on the two signup errors in BUG-22.
- `npm run build:check`: exports iOS, Android and web bundles to a temporary directory.
- `npm run check`: runs the full suite, type check and bundle exports; currently exits with failure because of BUG-22.

To run the repaired-bug regression checks:

```bash
node --import tsx --test tests/bug-fix-regressions.test.mjs
```

To reproduce one remaining bug, for example BUG-03:

```bash
MAMACARE_STRICT_KNOWN_BUGS=1 node --import tsx --test --test-name-pattern=BUG-03 tests/known-bugs.test.mjs
```

Use the Node version pinned in `.nvmrc`. If dependencies have not been installed, run `npm ci` first. Run `npm audit` to refresh the dependency findings in BUG-23. See [Testing](TESTING.md) for coverage and device checks.

## Results

| Check | Result |
| --- | --- |
| Full test run | 119 tests: **105 pass, 14 TODO, zero unexpected failures** |
| Strict known-bug run | **14 failures, zero passes**; exit 1, reproducing the remaining automated defects (BUG-08 has two assertions) |
| Time-zone tests | **26 checks in each of four zones pass**, 104 executions of a subset of the suite |
| TypeScript | **Fails with two existing errors**, both in inactive signup |
| Expo bundle export | **Web, iOS and Android all succeed** |
| Combined `npm run check` | Tests PASS, TypeScript FAIL, exports PASS; exit 1 |
| npm dependency audit | **35 findings: 13 moderate, 22 high, zero critical** after the security update; counts include transitive/tooling packages |
| Native binaries / phone delivery | Not built, installed or tested in this audit |

TODO assertions execute and fail; they are not successes or skipped checks. Strict mode removes the TODO allowance. See [Testing](TESTING.md) for the commands and exact test boundaries. Passing exports establish that bundles can be generated, not that an installed app works in every OS state.

### Browser observations

| Flow | Observation |
| --- | --- |
| EDD onboarding, Home/Profile, reload | October 15 EDD correctly produces 39w1d/third trimester on October 9; due date survives reload |
| Tour | Five steps complete; Settings replay opens step 1 and Skip dismisses the overlay |
| Medication create/edit/taken/unmark/reload | Normal flow works; history displays scheduled time as “Taken at” |
| Planner appointment edit | Saved October 10 appointment with `Audit clinic`; Home continues to show sample hospital and 14 days |
| Medical history save/revisit/reload | `Audit condition` appears during session and disappears after reload |
| Personal-information birth date | Clicking picker logs “DateTimePicker is not supported on: web”; no date can be selected |
| Nepali and Settings | Language can be selected; Settings/tour use English fallback; reload returns to English |
| Library/article/Danger Signs | Article navigation works; contact 8 expands with its danger signs |
| Notifications on web | Shows blocked permission and an Enable action despite no web notification implementation |

Tutorial replay evidence: [step 1 after replay](screenshots/tutorial-replay.png).

No real user medical information was needed. UI record deletion was not performed on a user's installation; delete behaviour was exercised using isolated provider tests.

## Priority definitions

- **P1:** address before relying on saved records or appointment summaries; dependency P1 means prompt security triage, not an established app exploit.
- **P2:** functional correctness, accessibility, compatibility or build hygiene needing correction.

## Findings

### BUG-01

**P1 — Personal information is lost after restart.** Evidence: automated real-provider restart test and source review.

- Source: [PersonalInformationContext](../src/context/PersonalInformationContext.tsx), [form](../src/screens/profile/PersonalInformationScreen.tsx).
- Reproduce on native: enter all required personal fields, save, terminate the app and reopen Personal Information. The provider test performs the same save/unmount/remount with retained storage.
- Expected: saved fields survive restart. Actual: the provider initializes empty fields; `savePersonalInformation` only calls `setState`. The form still reports “saved.”
- Fix direction: durable versioned storage, schema validation, hydration gate and visible read/write error handling. Clarify whether the display name is the same field (BUG-15).

### BUG-02

**P1 — Medical history is lost after restart.** Evidence: automated restart test and browser reproduction.

- Source: [MedicalHistoryContext](../src/context/MedicalHistoryContext.tsx), [screen](../src/screens/profile/MedicalHistoryScreen.tsx).
- Reproduce: add a synthetic condition/allergy, save, leave/revisit, then reload or fully restart. The entry survives only the first revisit.
- Expected: saved conditions/allergies survive restart. Actual: both arrays return to initial values; no storage read/write exists.
- Fix direction: persist only after successful hydration; validate records and surface save failures.
- Screenshots: [before reload](screenshots/history-before.png), [after reload](screenshots/history-after.png).

### BUG-03

**P1 — Medication history is overwritten before hydration.** Evidence: automated delayed-storage test executing the actual provider.

- Source: [MedicationContext](../src/context/MedicationContext.tsx), adherence-history loading and writing effects.
- Reproduce: run the strict BUG-03 test. It delays reading persisted history containing a previously taken dose while mounting the provider. An effect writes the initial empty array before the read finishes.
- Expected: no history write until the existing data is loaded successfully. Actual: the ungated duplicate write can erase the taken record, which subsequent backfill then labels missed.
- Fix direction: remove the ungated write and coordinate hydration/backfill so neither medication nor history defaults replace unread state. Add delayed reads in either completion order and foreground/restart coverage.

### BUG-04

**P1 — A medication storage read failure can erase saved medications.** Evidence: automated rejected-read test.

- Source: [MedicationContext](../src/context/MedicationContext.tsx), medication loading `.catch`/`.finally` and save effect.
- Reproduce: run strict BUG-04; the storage read rejects while an existing medication remains on disk. `hasLoadedState` becomes true and the empty initial state is written.
- Expected: retain disk data, present retry/error state and block unsafe writes. Actual: read failure is ignored and disk is overwritten with `[]`.
- Fix direction: distinguish successful empty load from failed load, and serialize writes. [Planner](../src/screens/planner/PlannerScreen.tsx) has a similar catch/finally/default-write pattern observed in source; that extension has not yet received its own failure-injection test.

### BUG-05

**P2 — Medication IDs collide within one millisecond.** Evidence: automated provider stress case.

- Source: [MedicationContext](../src/context/MedicationContext.tsx), `addMedication`.
- Reproduce: call add twice with the same controlled clock millisecond. Both IDs are `Date.now().toString()`.
- Expected: unique IDs. Actual: duplicate IDs make edit/delete/taken lookup ambiguous. This is a stress/API case, not an observed ordinary two-tap browser incident.
- Fix direction: robust unique IDs, with backward-compatible handling of existing records.

### BUG-06

**P1 — New Planner state contains a fabricated completed visit and appointment.** Evidence: automated default-state test and browser check.

- Source: [Planner defaultState](../src/screens/planner/PlannerScreen.tsx).
- Reproduce: open Planner on a clean storage origin. Contact 1 is completed and contact 2 has “Tuesday, Oct 24 - 10:00 AM,” City General Hospital, Ward C.
- Expected: no clinical visit completed without user confirmation; no real appointment until the user creates one. Actual: sample data is presented as user history. The sample date is also not a valid machine timestamp, so it produces no reminders.
- Fix direction: empty defaults and an explicit empty-state prompt. Decide how to remove demo data from previously saved state without removing real appointments.
- Screenshot: [Planner defaults](screenshots/planner-defaults.png).

### BUG-07

**P2 — ANC checkboxes lose their meaning when language changes.** Evidence: actual Planner rerender test.

- Source: [Planner checklist state](../src/screens/planner/PlannerScreen.tsx).
- Reproduce: check a contact item in English, switch to Nepali, reopen the same contact.
- Expected: the same clinical checklist item remains checked. Actual: saved entries use English translated strings; Nepali text no longer matches them.
- Fix direction: stable item IDs in storage and localized display labels; migrate existing translated strings carefully.

### BUG-08

**P2 — Height and weight validation accepts non-numeric text.** Evidence: separate automated form assertions for both fields.

- Source: [PersonalInformationScreen](../src/screens/profile/PersonalInformationScreen.tsx), `handleSave`.
- Reproduce with otherwise valid form data: enter `abc` for height, then separately weight, and save. Web's required birth-date picker defect means the full browser form cannot currently reach this step without a pre-existing date; the screen tests inject valid initial form data.
- Expected: reject non-finite numbers. Actual: `Number('abc')` yields `NaN`, for which both range comparisons are false, so the string is saved.
- Fix direction: require finite numeric values as well as range checks; test decimals, whitespace, infinity, zero and boundaries.

### BUG-09

**Status: fixed locally.** Safely reads optional route params, validates string IDs, and avoids inherited object keys. Missing/null/malformed params and prototype-like IDs now show the existing localized not-found message; normal article tests remain passing. Regression tests: `tests/bug-fix-regressions.test.mjs`.

**P2 — Article route with no parameters crashes instead of falling back.** Evidence: automated screen boundary test.

- Source: [article screen](../src/screens/article/%5Bid%5D.tsx).
- Reproduce: render/navigate to the article screen with `route.params` undefined (BUG-09 regression). Ordinary Library navigation supplies an ID and passed.
- Expected: show not-found content. Actual: destructuring `params.id` throws before the fallback can run. An unknown string ID already falls back correctly.
- Fix direction: safely read optional parameters and validate the ID before lookup.

### BUG-10

**Status: fixed locally.** The web field sends an empty string on clear, updating the parent value. Both date/datetime controlled-field regressions pass; browser clearing disables Next. Malformed nonempty values remain rejected. Regression tests: `tests/bug-fix-regressions.test.mjs`.

**P2 — Clearing a web date field retains the previously selected date.** Evidence: actual web input handler test.

- Source: [DateInput.web](../src/components/inputs/DateInput.web.tsx).
- Reproduce: select a valid date, then clear the native HTML field. The change handler gets an empty string and ignores the invalid Date instead of notifying the parent.
- Expected: clear the value used by subsequent save/validation. Actual: parent state retains the previous date and may render it back into the field.
- Fix direction: define an explicit empty value in the shared input contract and handle clear independently from invalid dates.

### BUG-11

**Status: fixed locally.** An empty list now offers the existing localized Add New Medication action. Nonempty pending and all-taken lists retain their separate behavior; English/Nepali action and navigation regressions pass. Regression tests: `tests/bug-fix-regressions.test.mjs`.

**P2 — Home says all medications were taken when none exist.** Evidence: automated Home rendering test.

- Source: [HomeScreen](../src/screens/home/HomeScreen.tsx).
- Reproduce: open Home with an empty medication list.
- Expected: an empty state, such as an invitation to add a medication. Actual: “All medications taken”/“You completed today's meds.”
- Fix direction: distinguish zero medications from a non-empty list with all doses taken, and localize both states.

### BUG-12

**P2 — Form logic accepts a typed EDD beyond the picker maximum.** Evidence: actual onboarding handler test with an out-of-range date.

- Source: [InitialSetupScreen](../src/screens/auth/InitialSetupScreen.tsx), [web date input](../src/components/inputs/DateInput.web.tsx).
- Reproduce: supply a syntactically valid date in 2035 through the field's change handler, then Continue. The picker supplies a maximum attribute, but submission does not enforce it.
- Expected: enforce the accepted date range before saving/advancing. Actual: the distant date advances onboarding. HTML picker constraints alone are not a submission policy.
- Fix direction: shared EDD/LMP range validation in save logic and visible localized errors; define the supported range with the product/clinical owner.

### BUG-13

**P2 — Nepali lacks 28 English localization keys.** Evidence: recursive key-parity assertion and browser Settings check.

- Source: [English](../src/localization/en.json), [Nepali](../src/localization/ne.json).
- Reproduce: select Nepali, open Settings or replay the tour. Strict BUG-13 lists every missing key.
- Expected: translated settings, tour copy and accessibility announcements. Actual: all `settingsScreen.*` and tutorial keys fall back to English.
- Fix direction: reviewed Nepali translations preserving interpolation tokens. Additional literal English in personal/medical forms and other screens requires a string audit beyond this missing-key test.
- Screenshot: [Settings after selecting Nepali](screenshots/settings-ne.png).

### BUG-14

**P1 — Home ANC summary ignores the saved Planner appointment.** Evidence: automated Home test plus browser appointment edit.

- Source: [HomeScreen](../src/screens/home/HomeScreen.tsx), ANC card hardcoded `14` and hospital translation.
- Reproduce: set the next incomplete contact to October 10, 2026 at `Audit clinic`; on October 9 return Home.
- Expected: show the saved appointment/facility and a one-day countdown. Actual: City General Hospital and 14 days remain displayed.
- Fix direction: shared Planner data/selectors, local-calendar countdown, explicit no-appointment state, and completion-aware next-visit selection.
- Screenshot: [Home after editing Planner](screenshots/home-anc-mismatch.png).

### BUG-15

**P2 — Saving personal name does not update the greeting/profile identity.** Evidence: actual personal provider plus Home test and source review.

- Source: [PersonalInformationContext](../src/context/PersonalInformationContext.tsx), [Redux store](../src/store/store.ts), [Home](../src/screens/home/HomeScreen.tsx), [Profile](../src/screens/profile/ProfileScreen.tsx).
- Reproduce on native: save a different full name, return Home/Profile.
- Expected: consistent identity across the app. Actual: personal `fullName` and Redux `userName` are independent; Home/Profile retain the Asha Sharma demo identity.
- Fix direction: one owned profile name with hydration and persistence; avoid updating just one screen's copy.

### BUG-16

**P2 — “Taken at” shows the scheduled time, not the action time.** Evidence: provider assertion and browser history observation.

- Source: [MedicationContext](../src/context/MedicationContext.tsx), [history screen](../src/screens/meds/history.tsx).
- Reproduce: set medication time to 11:59 PM, mark it taken in the afternoon, open history.
- Expected: either the real taken timestamp or a clearly labelled scheduled time. Actual: the record stores `medication.time`; history calls it the taken time.
- Fix direction: store scheduled occurrence separately from the action timestamp and define how existing history should be displayed.

### BUG-17

**Status: fixed locally.** Details and dose controls are sibling actions. The checkbox exposes name, checked state and disabled state through native accessibility props and ARIA, and disables edits outside today/yesterday. State changes and separate navigation are tested; full native screen-reader QA remains. Regression tests: `tests/bug-fix-regressions.test.mjs`.

**P2 — Medication taken control has no accessible name/role/checked state.** Evidence: actual Meds screen component assertion.

- Source: [MedsScreen](../src/screens/meds/MedsScreen.tsx).
- Reproduce: inspect the taken touch control or run the BUG-17 regression. It lacks checkbox semantics, readable name and checked state.
- Expected: a screen reader can identify the medication and whether its dose is taken. Actual: the actionable icon/touch area does not expose that information.
- Fix direction: appropriate role, localized label and checked state; verify both checked/unchecked with VoiceOver/TalkBack and keyboard. The assertion is not a substitute for that device audit.

### BUG-18

**P2 — Personal-information birth date picker is unsupported on web.** Evidence: browser click and console warning; no automated web-engine reproduction yet.

- Source: [PersonalInformationScreen](../src/screens/profile/PersonalInformationScreen.tsx).
- Reproduce in web: Profile → Personal Information → Date of Birth.
- Expected: an available date input. Actual: the native picker reports “DateTimePicker is not supported on: web,” renders no selectable date, and blocks saving a fresh required form.
- Fix direction: use the shared platform-specific DateInput rather than embedding the native picker. Test an actual empty browser profile through save.

### BUG-19

**P2 — Language returns to English after restart.** Evidence: browser change/reload and source review.

- Source: [i18n initialization](../src/localization/i18n.ts), language selection components.
- Reproduce: select Nepali, reload or terminate/reopen.
- Expected: retain the chosen language. Actual: initialization always uses `lng: 'en'`; no language storage/hydration exists. Rebuilt reminders can consequently return to English too.
- Fix direction: versioned saved language, validated supported codes and startup hydration before localized UI/reminder resync.

### BUG-20

**P2 — Web Notifications describes unsupported delivery as blocked permission.** Evidence: browser screen plus adapter/handler review. The OS-settings action was not clicked.

- Source: [NotificationsScreen](../src/screens/notifications/NotificationsScreen.tsx), [web adapter](../src/notifications/notificationAdapter.web.ts).
- Reproduce: open Notifications in web. It says notifications are blocked in device settings, offers Enable and shows zero pending reminders.
- Expected: explain that this build does not support browser reminders. Actual: the web adapter returns denied and the native-oriented screen offers `Linking.openSettings`, which is not a useful web recovery path.
- Fix direction: distinguish unsupported from denied and render appropriate platform guidance. Do not claim clicking Enable can grant a permission that has no implementation.

### BUG-21

**P2 — Logout has no durable signed-out state; account behaviour needs definition.** Evidence: source review, not an account security exploit.

- Source: [Profile logout](../src/screens/profile/ProfileScreen.tsx), [AuthStak](../src/navigation/AuthStak.tsx), [main stack](../src/navigation/MainAppNavStack.tsx).
- Reproduction path from code: confirm Logout; navigation resets to AuthStack. Saved due date remains, so a fresh launch starts Home again.
- Expected: a clearly defined logout/data-retention contract, or UI that accurately describes restarting setup in an account-free prototype. Actual: the action's name implies authentication behaviour that is not implemented.
- Fix direction: decide local reset versus real authentication. Do not erase health records merely to make the button appear to work. Sign-in/signup are intentionally disabled today.

### BUG-22

**P2 — Two inactive signup errors fail the whole-app type check.** Evidence: `npm run typecheck`.

- Source: [SignUPScreen](../src/screens/auth/SignUPScreen.tsx).
- Line 29: Create New Account passes no required `onPress` to AppButton (TS2741).
- Line 34: navigation to SignInScreen has no valid typed route overload (TS2769).
- Expected: `tsc --noEmit` passes even for inactive source files. Actual: both errors stop the type-check gate; Expo export still passes because it transpiles.
- Fix direction: either implement a coherent typed auth route/handler flow or explicitly remove/defer the inactive screen code. Avoid a no-op signup that falsely suggests account creation works.

### BUG-23

**Status: critical subfinding fixed locally; remaining dependency findings open.** `shell-quote` is locked at 1.12.0, satisfying its existing parent range. Audit now reports zero critical findings. Regression tests verify all four line terminators after comments are rejected, ordinary argument round trips still work, and the lockfile/installed version contains the patch. No generated shell strings are executed. [Updated audit snapshot](audit-results/npm-audit-after-five-fixes-2026-10-09.json).

**P1 security triage — Original dependency audit contained one critical and 22 high findings.** Evidence: npm registry audit of the installed lockfile. This is not a demonstrated vulnerability in the phone app.

- Original snapshot: [full dependency findings](audit-results/npm-audit-2026-10-09.json).
- Total: 13 moderate, 22 high, one critical. Counts include packages affected indirectly through dependencies, and development tooling; they are not 36 independent exploitable app flaws.
- Critical finding: transitive `shell-quote` 1.10.0, via React Native development tooling (`react-devtools-core`), covered by [GHSA-pqg4-j6r4-53mv](https://github.com/advisories/GHSA-pqg4-j6r4-53mv). The advisory concerns command quoting with a line terminator following a comment token.
- Expected: triage reachability and apply SDK-compatible fixes. Original finding: affected locked packages were installed; app exploitability was not established. The critical dependency is now patched; other affected packages still require triage.
- Fix direction: inspect every advisory/path, separate development and shipped dependencies, choose compatible patched versions, rerun audit/Expo compatibility/type/bundle/device checks. Some npm suggested fixes propose unrelated SDK major changes or downgrades; do not blindly use `npm audit fix --force`.

## Further review risks, not yet independent confirmed findings

- Medication and Planner writes are not consistently serialized, and write errors are swallowed. Fast edits and app termination need failure/race tests beyond the confirmed startup defects.
- Valid JSON with the wrong shape is cast as trusted medication/Planner state; schema validation and migration cases need coverage.
- Notification preference/enable handlers have no user-visible failure handling and can overlap optimistic updates. Add rejected writes/API calls and rapid-toggle tests.
- Medication details reset their draft on `medication` object changes; minute polling clones records. Inspect whether a long-running edit is discarded and add a reproduction before labelling it a confirmed bug.
- App ignores the `useFonts` error return. A font loading failure may leave the loading spinner indefinitely; inject that failure and add recovery.
- Medication preview chooses the first untaken record, not a time-sorted clinical priority. Define expected ordering rather than assume current insertion order is correct.
- Notification switches and other icon-only controls need a broader accessible-label/state audit. There has been no full VoiceOver/TalkBack, text scaling, contrast or keyboard QA.
- Content, reminder timing policies and baby-size references need an appropriate clinical/content review. Automated tests validate mechanics and structure, not clinical appropriateness.

## Planned features versus defects

Disabled account routes, symptom tracking, emergency contacts, help/support and profile-picture editing are visible implementation gaps. They should have an explicit product roadmap; this report does not claim they used to work or classify every coming-soon action as a regression. Accounts, cloud backups, export/restore, secure storage policy and migration support must be designed before release claims about those features.

## Remaining repair order

1. Fix BUG-01–04 and define safe hydration, schema validation and failed-save behaviour for all durable records.
2. Remove fabricated Planner state; connect Home to real appointments (BUG-06/14); stabilize IDs/checklist identity (BUG-05/07).
3. Correct form/date constraints, history timestamps and identity (BUG-08/12/15/16), and enable the web birth-date input (BUG-18).
4. Finish language persistence/translations (BUG-13/19), broader device accessibility QA, and the unsupported notification state (BUG-20).
5. Resolve the logout/account contract, remove type-check failures and triage dependencies (BUG-21–23).
6. Continue promoting future repaired TODOs to normal passing regression tests, then complete the real-device checklist in [Testing](TESTING.md) and [Notifications](NOTIFICATIONS.md).

Use the executable BUG assertions as acceptance checks; keep this report's status and evidence updated as fixes land. Repeat `npm audit` before choosing package fixes because registry findings can change after this dated snapshot.
