# Revolt Frontend

This repository contains the code for Revolt's frontend, built with Solid.js.

## Development Guide

Before contributing, make yourself familiar with [our contribution guidelines](https://developers.revolt.chat/contrib.html), the [code style guidelines](./GUIDELINES.md), and the [technical documentation for this project](https://revoltchat.github.io/frontend/).

Before getting started, you'll want to install:

- Git
- Node.js
- pnpm (run `corepack enable`)

Then proceed to setup:

```bash
# clone the repository
git clone --recursive https://github.com/revoltchat/frontend client
cd client

# update submodules if you pull new changes
# git submodule init && git submodule update

# install all packages
pnpm i

# build deps:
pnpm build:deps

# or build a specific dep (e.g. revolt.js updates):
# pnpm --filter revolt.js run build

# Optionally copy the .env file
cp ./packages/client/.env.example ./packages/client/.env

# run dev server
pnpm dev:web
```

Finally, navigate to http://local.revolt.chat:5173.

### Faster iteration with Revolt.js

To make it easier to work with `revolt.js`, you may want to temporarily make this change:

```diff
# packages/revolt.js/package.json
-  "module": "lib/esm/index.js",
+  "module": "src/index.ts",
```

Any edits to the revolt.js codebase will immediately be reflected while developing.

## Deployment Guide
```bash
# clone the repository
git clone --recursive https://github.com/revoltchat/frontend client
cd client

# install packages
pnpm i

# build dependencies
pnpm build:deps

# build web in production mode
pnpm build:web:prod
```

You can now deploy the directory `packages/client/dist`.

## Routing Information

The app currently needs the following routes:

- `/login`
- `/pwa`
- `/dev`
- `/settings`
- `/friends`
- `/server`
- `/channel`

This corresponds to [Content.tsx#L33](packages/client/src/index.tsx).
