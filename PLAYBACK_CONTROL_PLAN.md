# Playback Control Simplification Plan

Status: planning only. This document proposes UI and naming changes; no playback behavior has been changed yet.

## Problem

The script currently exposes several playback actions that all read like "play":

- `Toggle playback`: global audio transport play/pause at the current time.
- `Restart playback`: jump to a subtitle or time and continue playback from there.
- `Toggle play and pause`: play the selected subtitle range once, then pause at its end.
- `Toggle playback loop`: repeatedly play the selected subtitle range.
- Audiobook toolbar controls can apply the range actions to the current bookmarked or merge-filtered subtitle set.

The behaviors are useful, but the labels and icons do not make the target scope clear. Users have to infer whether a button controls the whole audio file, the current subtitle, or a filtered subtitle selection.

## Design Goal

Use one mental model everywhere:

- **Audio** controls the current global transport.
- **Line** controls the currently selected or active subtitle.
- **Selection** controls the current bookmarked or merge-filtered subtitle set.

Every playback button should answer two questions in its title or nearby grouping: what scope it affects, and whether it continues, pauses at the end, or loops.

## Proposed Actions

Keep the existing runtime behavior, but present these labels:

- `Play/pause audio`: global transport toggle. Use only in the footer/player transport area by default.
- `Play from line`: jump to the selected subtitle and keep playing normally.
- `Play line once`: play the selected subtitle range and pause at the end.
- `Loop line`: loop the selected subtitle range until stopped.
- `Play selection once`: play the filtered/bookmarked/merged subtitle set and pause at the end.
- `Loop selection`: loop the filtered/bookmarked/merged subtitle set.

## UI Changes

1. Make the footer/player transport the only default location for global audio play/pause.
2. In reader and subtitle action menus, group range playback controls under a small "Line" action group.
3. In the audiobook toolbar, label batch playback controls as selection controls and only enable them when a bookmark or merge filter is active.
4. Use distinct icons for the different scopes:
   - global audio: play/pause circle
   - play from line: playlist/play icon
   - play line once: play-pause or play-box icon
   - loop line: loop/refresh icon
5. Update tooltips to be explicit:
   - "Play/pause audio"
   - "Play from this line and continue"
   - "Play this line once, then pause"
   - "Loop this line"
   - "Play filtered subtitles once, then pause"
   - "Loop filtered subtitles"

## Implementation Steps

1. Add action display metadata that maps each `Action` to a label, tooltip, icon, and playback scope.
2. Render action buttons from the metadata in `ActionButtonList.svelte` instead of duplicating labels and icons inline.
3. Update the default reader/subtitle/footer action lists so new installs show fewer duplicate play controls by default.
4. Preserve existing user customizations. `Action` enum values are currently persisted as strings, so any rename needs either a migration or a separate stable action id before changing stored values.
5. Update settings labels and keybinding descriptions to use the same action display metadata.
6. Add tests for the action metadata and any settings migration.
7. Verify the reader menu, subtitle list actions, footer/player transport, keyboard shortcuts, and audiobook filtered-selection controls.

## Migration Note

Do not directly rename the string values in `Action` as a first step. Existing settings persist those values in the action-list stores, so a direct enum rename would silently drop or disable user-configured actions. First introduce stable action ids or a migration from old labels to new labels.
