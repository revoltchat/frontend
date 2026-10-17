# Axiom foundation

Axiom is built on Stoat's existing application architecture, using Nexus v12 as the primary visual/UX reference.

## Code ownership
- Frontend: retain the Stoat for Web SolidJS, TypeScript, Vite and Panda CSS architecture, routing, application stores, accessibility, authentication, messaging, and tests.
- Backend: axiom_backend is a fork of Stoat self-hosted Compose deployment configuration, not the Rust API and events source repositories. The deployment currently references versioned upstream container images.
- Nexus: transfer UI conventions and user interaction design, not its Python JSON authentication/storage or browser polling implementation.
- License: preserve AGPL-3.0, attribution, upstream notices and third-party assets' rights.

## Roadmap
1. Create namespaced Axiom design tokens drawn from Nexus (this branch). No runtime changes.
2. Identify Stoat's existing theme pipeline; integrate an optional Axiom theme without global overrides.
3. Restyle friends, server navigation, channels, chat bubbles, attachment cards, dialogs and settings using existing Solid components.
4. Design original Axiom branding, while retaining required upstream notices.
5. Deploy isolated backend with production secrets, storage, backups, and security configuration.
6. Validate build, typecheck, lint, authenticated routes, permission enforcement, file upload, cross-device messaging, responsive layout and reduced motion.

## Palette and interaction seed
Nexus v12 colors: canvas #050505, panel #101010, surface #171717, border #343434, muted text #858585, accent #167bda. Control radius 11px; panel radius 22px. Avoid abrupt animation and honor prefers-reduced-motion.

The stylesheet at packages/client/src/axiom/theme.css is intentionally opt-in and **not imported**. Its variables are namespaced to avoid breaking the existing app while we trace Stoat's theme implementation.
