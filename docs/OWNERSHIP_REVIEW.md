# Ownership review for the five fixes

Checked the live GitHub issue list, issue bodies/comments and open pull requests on 2026-10-09. This is a dated scope check, not a claim to know work that teammates have not recorded.

| Open issue | Assignees | Scope reserved for its owners |
| --- | --- | --- |
| [#17 — Setup State Management](https://github.com/uwa-spgh/cits3200-mamacare/issues/17) | Angelica-Valencia | Persistence/providers/shared state: includes the high-priority profile/history data-loss bugs and sharing Planner data with Home. The issue has no detailed body or comments, so this was treated conservatively. |
| [#23 — Localization](https://github.com/uwa-spgh/cits3200-mamacare/issues/23) | Angelica-Valencia | Missing Nepali strings, language persistence and translation identity. No localization files were edited for this batch. |
| [#10 — Settings/Profile & Notifications](https://github.com/uwa-spgh/cits3200-mamacare/issues/10) | Angelica-Valencia, M3greL | Profile/settings/notification implementation. Latest comment says only Notifications is missing; those screens/providers were left for their owners. |
| [#33 — Emergency Contacts](https://github.com/uwa-spgh/cits3200-mamacare/issues/33) | zhiruiChen1 | Emergency contacts feature. |
| [#5 — Splash and intro](https://github.com/uwa-spgh/cits3200-mamacare/issues/5) | Angelica-Valencia, M3greL | Intro/onboarding implementation. Comment records the first three screens as done; no intro screen was modified in this batch. |
| [#36 — Testing and Documentation](https://github.com/uwa-spgh/cits3200-mamacare/issues/36) | rileypigneguy, MCvee32, M3greL | Shared testing, bug fixes and documentation; this batch is within the user's assigned work. |

The only open PR is [#22](https://github.com/uwa-spgh/cits3200-mamacare/pull/22), `feature/settings-screen`, by M3greL. It changes older `app/` settings/notifications/navigation and `app/+not-found.tsx`. The article parameter guard below changes the current `src/screens/article/[id].tsx`, not that PR's not-found page. Both touch dependency files at a general level, but #22 does not implement the `shell-quote` security update.

## Selected fixes

| Finding | Change | Reason for selection |
| --- | --- | --- |
| BUG-23, critical subfinding | Locked `shell-quote` 1.12.0, within the existing parent range; regression checks reject line terminators after a comment | Highest-severity available dependency finding; no recorded active security fix. Other dependency findings remain open. |
| BUG-09 | Guard missing/malformed article params and inherited object keys | Prevents a screen crash, without modifying the separate not-found page in PR #22. |
| BUG-10 | Shared web DateInput reports `""` when cleared | Prevents silently retaining an old date. No state-provider or intro implementation changes. |
| BUG-17 | Named checkbox with native/ARIA checked and disabled state, separate from details button | Lets users identify and operate taken-dose controls; no medication state/storage redesign. |
| BUG-11 | Empty Home medication list offers the existing localized Add New Medication action | Removes a false adherence-completion claim, using existing translations without taking localization work. |

These are the highest-impact fixes selected outside the reserved scopes. The P1 data-loss and appointment-display defects remain important, but were not taken over from state-management work. No GitHub issue was reassigned, closed or commented on, and no teammate was messaged.

## Verification

- Full suite: 119 tests, 105 pass, 14 known-defect TODO assertions, zero unexpected failures.
- The four repaired application assertions are now ordinary regression tests in `tests/bug-fix-regressions.test.mjs`, with extra malformed-input, state-change and navigation cases.
- Three dependency regressions verify locked/installed patched versions, rejection of all four line terminators after comments, and ordinary quote/parser compatibility. They never execute generated shell strings.
- Audit: zero critical findings; 35 moderate/high findings remain.
- iOS, Android and web bundle exports pass. TypeScript still fails only on the two existing inactive signup errors.
- Browser checks: clearing EDD disables Next; empty Home opens Add Medication; Meds checkbox toggles without navigating, and details remain separately reachable. Final ARIA state is checked in the updated browser build.
- Native VoiceOver/TalkBack and real-device notification delivery remain manual checks.

Browser evidence: [cleared date](screenshots/fixed-date-clear.png), [empty Home](screenshots/fixed-empty-home.png), [checked medication](screenshots/fixed-checkbox.png).

See [Bug report](BUG_REPORT.md) for updated statuses and [Testing](TESTING.md) for commands. Changes are local to `fix-pregnancy-details` and are not yet merged.
