# Yatsu Whispersync

Yatsu Whispersync is a Yatsu-compatible build of
[ttu-whispersync](https://github.com/Renji-XD/ttu-whispersync), a userscript /
Chrome extension for listening to audiobooks while reading.

This fork keeps the upstream audiobook, subtitle matching, reader highlighting,
and optional Anki export behavior, while adapting the userscript metadata,
reader bootstrap selectors, docs links, and injected UI styling for
[Yatsu Reader](https://app.yatsu.moe).

## Install

The Yatsu docs host the recommended userscript build:

<https://docs.yatsu.moe/assets/yatsu-whispersync.user.js>

Install it with a userscript manager such as
[Violentmonkey](https://violentmonkey.github.io/), then open a Yatsu book at
`https://app.yatsu.moe/b?id=...`.

## What Changed From Upstream

-   Targets `https://app.yatsu.moe/*` instead of `https://reader.ttsu.app/*`.
-   Uses the Yatsu docs icon, support URL, and install/update URLs.
-   Reads Yatsu's reader DOM compatibility hooks.
-   Styles the injected footer controls, popovers, side panel, buttons, tabs,
    inputs, subtitle list, and dialogs with Yatsu-like surface, border, focus,
    and hover treatments.
-   Uses softer default active subtitle colors.
-   Includes the upstream MIT license notice in generated userscript builds.

## Development

```bash
pnpm install
pnpm run check
pnpm run test
pnpm run build
```

Build outputs are written to:

-   `violent_monkey/yatsu-whispersync.user.js`
-   `tamper_monkey/yatsu-whispersync.tm.user.js`

The repo intentionally keeps those build directories ignored. Attach generated
userscripts to GitHub releases or copy the selected build into the Yatsu docs
asset pipeline.

## Attribution

Original project:
[Renji-XD/ttu-whispersync](https://github.com/Renji-XD/ttu-whispersync)

Original author: Renji-xD.

Yatsu-compatible modifications are attributed in the userscript metadata.

This project preserves the upstream MIT license in [LICENSE](LICENSE) and in
generated userscript headers.
