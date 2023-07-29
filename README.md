# ‼️ READ: Please **do not create any issues** and clear any PRs with me ahead of time (some PRs may be rejected at this stage).

This is still in very heavy development, and we are currently overhauling a lot of the UI on our own private downstream branch, as such we may be limiting PRs to purely functional changes in certain cases (i.e. which don't have to touch UI) so it is best that you liase with someone on the team first to ask about whether a certain part of the project may be worked on.

# Revolt Frontend

See [code style guidelines here](./GUIDELINES.md)!

## Setup locally

```bash
# clone the repository
git clone --recursive https://github.com/revoltchat/revoltchat-solid-client-monorepo client
cd client

# update submodules if you pull new changes
# git submodule init && git submodule update

# install all packages
pnpm i

# build deps
pnpm build:deps

# or build a specific dep: (i.e. revolt.js updates)
# pnpm --filter revolt.js run build

# run dev server
pnpm dev
```

Finally, navigate to http://local.revolt.chat:5173.

## Build client

```bash
# install packages
pnpm i

# build everything
pnpm build:all
```

## Pulling in Revolt's assets

If you want to pull in Revolt brand assets after pulling, run the following:

```bash
# update the assets
git -c submodule."packages/client/assets".update=checkout submodule update --init packages/client/assets
```

You can switch back to fallback assets by running deinit and continuing as normal:

```bash
# deinit submodule which clears directory
git submodule deinit packages/client/assets
```

## Faster iteration with Revolt.js

To make it easier to work with `revolt.js`, you may want to temporarily make this change:

```diff
# packages/revolt.js/package.json
-  "module": "lib/esm/index.js",
+  "module": "src/index.ts",
```

Any edits to the revolt.js codebase will immediately reflect while developing.

## Using `pnpm`

Add a new package to a workspace:

```bash
pnpm add solid-hcaptcha --filter @revolt/auth
```

# Deployment Information

The app currently needs the following routes:

- `/server`
- `/channel`
- `/friends`
- `/admin`
- `/app`
- `/pwa`
