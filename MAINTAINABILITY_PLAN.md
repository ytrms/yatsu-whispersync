# Maintainability Plan

## Goal

Address the maintainability issues found in the review while preserving the
current Yatsu-specific userscript behavior, metadata, build outputs, and release
asset names.

## Checklist

- [x] Centralize action definitions so there is one source of truth.
- [x] Decouple action button disabled state from tooltip/display text.
- [x] Extract pure subtitle matching helpers from `Match.svelte` and cover them
      with focused unit tests.
- [x] Reduce playback position persistence churn from frequent audio events.
- [x] Make settings metadata harder to drift and add the missing tracker pause
      default/type entry.
- [x] Harden localStorage-backed store parsing against malformed values.
- [x] Clean up menu resize event listeners on component teardown.
- [x] Centralize userscript build header metadata and fix development mode
      script typos.
- [x] Run `pnpm run test`, `pnpm run check`, and `pnpm run build`.

## Progress Notes

- Plan created before implementation.
- Centralized `Action` through `settings.ts` and re-exported it from
  `actions.ts` for compatibility.
- Added missing/defaulted setting keys so localStorage-backed store calls must
  reference known settings keys.
- Added explicit disabled props to action buttons and moved shared action
  availability checks out of tooltip string comparisons.
- Extracted normalization, comparison-window, and similarity helpers into
  `src/lib/matching.ts` with focused Vitest coverage.
- Throttled playback position writes during `timeupdate` while preserving a
  forced write on pause.
- Added default fallback and cleanup for malformed localStorage values, with
  tests for JSON, boolean, and number stores.
- Added explicit resize pointer-listener cleanup on side-menu teardown.
- Moved userscript headers and build-output names into shared metadata/config
  helpers, and fixed the `development` mode script typo.
- Verified with `pnpm run test`, `pnpm run check`, and `pnpm run build`.
- Verified the corrected development build path with `pnpm run build:dev`.
