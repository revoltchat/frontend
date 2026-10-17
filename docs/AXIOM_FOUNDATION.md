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
