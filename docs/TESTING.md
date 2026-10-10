# Testing MamaCare

## Setup and commands

```bash
cd ~/Code/mama-care
nvm install
nvm use
npm ci
npm test
```

A fresh `npm ci` install was verified against the updated lockfile. Node is pinned in `.nvmrc`; use it in CI too. The scripts use Node's test runner and `tsx`, discover `*.test.ts`, `*.test.tsx` and `*.test.mjs` under `src` and `tests`, and default to the Perth time zone unless `TZ` is explicitly provided.

| Command | Purpose | Audited outcome |
| --- | --- | --- |
| `npm test` | All regression checks and labelled known-defect assertions | 119 tests: 106 pass, 13 TODO, zero unexpected failures; exit 0 |
| `npm run test:known-bugs` | Strictly execute the BUG assertions | 13 failures; exit 1 while the defects remain |
| `npm run test:timezones` | Pregnancy/storage/reminder dates across four time zones | 26 checks × four zones = 104 passing executions |
| `npm run typecheck` | Full TypeScript check | Two errors in inactive `SignUPScreen.tsx`; exit 2 |
| `npm run build:check` | Expo exports for iOS, Android and web | All three export successfully; exit 0 |
| `npm run check` | Run tests, TypeScript and exports even when a step fails | Tests PASS, TypeScript FAIL, exports PASS; exit 1 |
| `npm audit` | Registry dependency vulnerability review | 35 remaining findings, zero critical after the selected fixes; includes transitive/dev dependencies |

Exports are written to a new system temporary directory, with its path printed. They do not build/sign/install a native binary. Remove old temporary artifacts when no longer needed.

### Known defects are not passes

`knownBug(...)` uses Node's TODO marker so routine regression checks can remain usable while a separately documented backlog exists. Its assertion **runs and fails**; TODO is not a skipped test or a claim that the behaviour works. Only tests deliberately tied to a BUG ID receive this marker. Any unrelated failure fails the ordinary command.

Strict mode removes the TODO marker and exits with failure. Before marking a bug fixed, make its strict assertion pass, convert `knownBug(...)` to a normal `test(...)`, add any needed boundary cases, and update [the report](BUG_REPORT.md). A TODO that starts passing must be promoted to a normal regression test.

Run an individual group or assertion:

```bash
node --import tsx --test tests/provider-lifecycle.test.mjs
node --import tsx --test src/pregnancy/progress.test.ts
MAMACARE_STRICT_KNOWN_BUGS=1 node --import tsx --test --test-name-pattern=BUG-03 tests/known-bugs.test.mjs
```

## Automated coverage

| Files | Coverage |
| --- | --- |
| `src/pregnancy/*.test.ts` | EDD/LMP calendar math, trimester boundaries, invalid dates, overdue/pre-pregnancy cases, weekly baby-size lookup, storage normalization, ordered writes and failures |
| `src/notifications/*.test.ts` | Medication planning, ANC offsets, capacity ordering, taken-day suppression, valid/invalid payload routing |
| `tests/provider-lifecycle.test.mjs` | Real medication provider CRUD, restart restoration, backfill, local-day reset, overdue polling, subscription/timer cleanup; personal and medical session saves |
| `tests/bug-fix-regressions.test.mjs` | Repaired BUG-06 completion default and BUG-09/10/11/17, malformed article params/IDs, controlled date clearing, Home empty/nonempty actions and unticking individual completed doses, native/ARIA checkbox state/disable/navigation, and three critical-dependency regressions |
| `tests/known-bugs.test.mjs` | Open reproductions for BUG-01–05, BUG-07–08, BUG-12 and BUG-14–16; two assertions for BUG-08 |
| `tests/content-contracts.test.mjs` | Article/topic IDs, translated sections, danger-sign contacts, read times, interpolation parity, tutorial English keys, six icon families, missing Nepali keys (BUG-13) |
| `tests/screens.test.mjs` | Library search/categories, all seven articles in both languages, invalid article ID, eight danger-sign accordions, medication form validation, unknown medication, Planner save/reload and web date selection |
| `tests/notification-service.test.mjs` | Preference defaults/merge/corrupt input, queue ownership/cancellation, cap and priority, language, permission denial, scheduling failure recovery and concurrent rebuilds |
| `tests/native-adapter.test.mjs` | iOS permission mapping, Android channels before prompt, owned reminder filtering, trigger/sound/data, listener cleanup, cancellation and foreground presentation policy |
| `tests/notification-routing-integration.test.mjs` | Real coordinator readiness and warm/cold start routes for all three reminder kinds, clearing processed responses and ignoring unowned payloads |
| `tests/native-date-input.test.mjs` | iOS confirmation/cancellation and Android two-stage date/time picker with dismissal |
| `tests/reminder-boundaries.test.mjs` | AM/PM and Nepali time parsing, local date/month/DST boundaries, taken-day suppression, queue tie ordering and ANC expiry boundaries |
| `tests/tutorial.test.mjs` | Start/retry gates, subscriptions, viewport edge placement, tiny spotlight bounds, settled measurements and cancellation |

The time-zone runner uses Perth, Los Angeles, Kathmandu and Kiritimati to cover whole-hour, DST, fractional-hour and far-ahead offsets. These 104 executions repeat a subset of the 119-test suite; they are not 104 additional distinct tests.

## Harness boundaries

Component/provider tests load the actual TypeScript modules using TypeScript transpilation and execute them with real React 19.2.3 hooks. The harness controls AsyncStorage latency/errors, local clock, minute timers, foreground listeners, navigation and platform primitives. Notification-service tests replace its device adapter; adapter tests replace Expo's OS API. Assertions exercise app logic instead of a separately copied implementation.

These checks cannot establish native layout, touch handling, screen-reader announcements, OS permissions, alarm timing, battery restrictions or network reachability. The browser audit used the exported web app and synthetic records on localhost. It is documented evidence, not an automated browser suite.

React prints a `react-test-renderer` deprecation warning. It is pinned to the app's exact React version for this suite. Migrate component tests to a supported renderer before adopting a React version that removes it; do not silence other warnings or reinterpret the warning as native test coverage. TypeScript still needs its own check because transpiling test imports does not type-check them.

## Manual QA and release checklist

Use synthetic records and a separate test installation. Browser storage, simulator storage and physical-phone storage are different. Record OS/build version, time zone, locale, test date, permission state and screenshots for each run. The audit fixed the test clock at 2026-10-09; substitute the current day when testing manually.

| Flow | Procedure | Audit coverage / outstanding work |
| --- | --- | --- |
| Onboarding | Fresh installation; choose language; enter EDD and separately LMP; finish permission explanation and welcome | EDD browser flow and calculation tests passed; fresh native LMP flow remains |
| Pregnancy | Set EDD six days ahead; verify 39w1d/third trimester/six days, Profile EDD and week-39 baby size; edit and reload | Browser and date/storage tests passed; native day rollover/locale layout remains |
| Tour | Finish all five steps; replay from Settings; skip; check small phone, tablet, landscape and enlarged text | Five-step browser tour plus helper tests passed; native accessibility/layout remains |
| Medication | Add/edit; mark taken; unmark; reopen; confirm dose/time/period; remove disposable fixture | Browser creation/edit/toggle/reload and provider tests passed; removal checked automatically, not manually on phone |
| History | Take one dose, leave another missed, cross midnight; reopen with slow reads and storage errors | Logic tested; delayed reads reproduce BUG-03/04; physical-device rollover remains |
| Planner | Edit a real date/time/facility; save notes/checks/completion; reopen; compare Home; change language | Normal save/reload tested; browser exposes BUG-06/14 and test exposes BUG-07 |
| Personal info | Enter all fields; reject letters and out-of-range numbers; save; terminate/reopen; compare greeting | Session logic tested; BUG-01/08/15/18 remain |
| Medical history | Save condition/allergy; revisit within session; terminate/reopen | Browser and provider test reproduce lost records, BUG-02 |
| Library | Search by title; empty search; filter categories; open seven articles; back; expand contacts 1–8 | Automated screen tests passed; browser article navigation and contact 8 expansion passed |
| Language | Switch Nepali; check every screen, tour, names, dates, error text and reminder text; reopen | Article/content tests and browser checks; missing keys and reset BUG-13/19 |
| Native notifications | Follow medication/ANC/category/language/denied-permission procedures in [Notifications](NOTIFICATIONS.md) | Planning, service, adapter and routes tested; delivery on iOS/Android NOT performed |
| Android alarms | Rebuilt app; exact-alarm access off/on; lock and background; repeat with battery restrictions | NOT performed; exports do not verify this |
| Notification launch | Tap medication/ANC/education alerts when running, backgrounded and terminated; remove a referenced item and tap stale alert | Mock coordinator routes passed; actual OS launches and stale notification UX remain |
| Persistence failures | Kill during save; reject reads/writes; malformed and wrong-shape JSON; rapid edits before/after hydration | EDD failures and medication delayed/read-failure cases covered; other failure paths require fixes and more tests |
| Accessibility | VoiceOver/TalkBack, keyboard, focus order, accessible labels, switch checked states, text scaling/contrast and Nepali announcements | BUG-17 repaired with native/ARIA state assertions and browser verification; full assistive-tech audit NOT performed |
| Logout/accounts | Define signed-out state and retained data; test startup and account isolation if accounts are added | Accounts disabled, BUG-21/22; product contract unresolved |
| Offline/network | Airplane mode for saved content and pending native reminders; change Wi-Fi/IP; try tunnel | No actual phone offline/network-delivery test performed |
| Release install | Build/sign/install actual development/release clients; cold start; upgrade old data; uninstall/reinstall | Bundle export only; binary builds, migrations and upgrade tests NOT performed |

Do not claim release readiness until data loss defects are fixed, the full type check passes, dependency findings are triaged, and device checks have recorded results. Content structure tests do not replace clinical review of pregnancy/ANC/medication information.
