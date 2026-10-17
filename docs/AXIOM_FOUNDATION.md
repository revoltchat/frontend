# Axiom — Phase 1: Stoat Core, Nexus Identity

## Non-negotiable architecture
- **Primary product codebase:** this Stoat-derived Solid + TypeScript monorepo. Keep the existing router, client library, component organization, state management, UI provider, i18n, and builds.
- **Backend:** the companion Stoat-derived Rust repository (`axiom_backend`). Its authentication, permission checks, message APIs, real-time semantics and file services stay authoritative.
- **Design reference:** Nexus v12, specifically its dark-first palette, blue primary actions, compact server rail, friend/DM discoverability, chat bubbles, notification dots, and fluid transitions. Do **not** copy the old Nexus Python account or messaging backend into Stoat.
- Keep upstream notices and required license attribution. Record upstream sync and any significant divergence.

## Extracted Nexus v12 tokens
| Role | Value |
|---|---|
| Canvas | `#050505` |
| Main surface | `#101010` |
| Raised surface | `#171717` |
| Border | `#303030` |
| Main text | `#eeeeee` |
| Muted text | `#858585` |
| Primary blue | `#0878d5` |
| Hover blue | `#2698f3` |
| Notification/error red | `#f04452` |

The Axiom starting layer is `packages/client/src/axiom-theme.css` and is now mounted by the signed-in `Interface.tsx` app shell on this feature branch. The auth page and backend are unchanged. This remains a draft until the full client build, visual checks, and regressions pass.

## Implementation roadmap
1. **Foundation** — confirm build, test and dependency health; upstream licenses; visually compare Nexus reference against Stoat client. Add opt-in color/motion tokens.
2. **Shell** — create an Axiom-branded responsive frame around the existing navigation and data-backed server/channel lists; keep keyboard navigation and screen readers usable.
3. **Messaging** — restyle Stoat messages and media attachments. Reuse Stoat's upload/download API, not Nexus's JSON or Python storage logic.
4. **Social and moderation** — preserve backend permission checks, blocks, invitations, server settings and moderation; improve frontend affordances only.
5. **Launch safety** — integration/e2e coverage for sign-in, DM authorization, attachment privacy, file limits, moderation, mobile layout, and reconnect handling.

## Acceptance criteria for theme activation
- Existing sign-in, sign-up, server list, DMs, attachments, voice integrations and moderation remain functional.
- Desktop and mobile layouts remain scrollable and keyboard-accessible.
- Reduced-motion preference is honored.
- Theme can be toggled or removed cleanly without database changes.
- No secrets, account stores, or user uploads enter Git.

## Phase 2 integration status (draft)
- `Interface.tsx` imports the scoped Axiom theme and mounts `axiom-theme` on `AppRoot`.
- Existing Stoat server list, channel list, routes, account flows, and components remain authoritative.
- Signed-in app palette changes to Nexus-inspired charcoal surfaces with blue primary accents.
- Focus-visible indicators and reduced-motion handling are retained.
- **Not yet verified:** full pnpm build, visual screenshots, contrast audit, mobile layout, and theme switching. Do not merge for production until these checks pass.

## Phase 3: navigation facelift (draft branch)
- Added `axiom-server-rail` to the existing `ServerListBase`.
- Added `axiom-channel-sidebar` to the existing HomeSidebar and ServerSidebar wrappers.
- Extended the scoped Axiom stylesheet to style rail/backgrounds, hover treatments, accessibility focus, and reduced-motion behavior.
- **No replacement of server ordering, channel selection, incoming request indicators, DM state, or permission-aware settings.**
- Not yet implemented: final messaging surface and full settings/auth visual redesign.

### Regression test checklist before merging
- Confirm server drag-and-drop works with the new rail padding.
- Confirm the channel rail still scrolls with many channels and folders.
- Verify responsive layout on phone/tablet/desktop.
- Verify colors with Stoat dark and light profiles (Axiom is currently dark-first).
- Confirm friend-request/unread badges and channel selection remain visible.
- Run `pnpm install --frozen-lockfile` and the project build/test scripts in a suitable development environment.

## Phase 4: Nexus-style messaging surfaces (draft)
- Added `axiom-message` to Stoat's existing message container; its author, edited-state, reaction, highlight, toolbar and authorization behaviors are unchanged.
- Added `axiom-composer` to the existing `MessageBox` layout, preserving the ProseMirror-based editor, send callbacks and timed-out/read-only state.
- Added `axiom-attachment` and `axiom-inline-image` / `axiom-inline-video` hooks to Stoat's existing file renderer. Its image viewer, media URLs, spoiler treatment and context menus remain untouched.
- Scoped message, inline-media, attachment-card, and composer styles to the `axiom-theme` root.
- No backend changes; uploads and file authorization remain served by Stoat.

### Required manual checks before merging
- Composer: type, edit last message, mention autocomplete, emoji picker, drag-and-drop files, upload multiple attachments, cancel upload, send and permission-denied state.
- Messages: context menu, reactions, replies, editing, deleting, timestamps, mentions, grouped messages, scrolling back through history.
- Media: image viewer, GIFs, video playback, spoilers, original file downloads, long filenames, failed image loads.
- Check keyboard tab/focus, mobile composer safe area, reduced-motion settings, large attachments and responsive widths.
- Run full workspace build/tests and inspect the new CSS in both default and customized Stoat themes. Status: NOT YET RUN.

## Phase 5: authentication, settings and initial product branding (draft)
- The browser tab title is now `Axiom`.
- The existing logged-out Solid auth shell now shows an Axiom wordmark (text instead of the former Stoat SVG) and `New to Axiom?` copy.
- Added `axiom-auth` scoped styling for a dark-first login/register frame with blue accents. Authentication endpoints, form submission, rate-limit behavior, and session lifecycle are unchanged.
- Added `axiom-settings-overlay` scoped styling on Stoat's existing user, server, and channel settings modal; preserves all navigation, settings actions, and server-side permissions.
- Added `packages/client/src/axiom-brand.css`, imported once from the client entrypoint.
- **Branding incomplete:** browser favicon/PWA assets, upsell/promotional copy, i18n catalog entries, emails, instance configuration, and some UI strings may still say Stoat.
- **Legal links intentionally remain upstream** until Axiom-specific policies/support contacts exist. Do not imply these links are Axiom's legal policies.
- Pending: full pnpm build/typecheck/tests; audit visual contrast, language translations, settings navigation, account recovery, mobile scroll, theme switching and auth flow error states. Never deploy publicly until verified.
