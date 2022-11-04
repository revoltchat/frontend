# Solid App (name TBD)

This is still a work in progress, please **do not create any issues** and clear any PRs with me ahead of time.

See [code style guidelines here](./GUIDELINES.md)!

## Setup locally

```bash
# clone the repository
git clone --recursive https://github.com/revoltchat/revoltchat-solid-client-monorepo client
cd client

# install all packages
pnpm i

# build deps
pnpm build:deps

# or build a specific dep: (i.e. revolt.js updates)
# pnpm --filter revolt.js run build

# run dev server
pnpm dev
```

Now navigate to http://local.revolt.chat:5173

## Build client

```bash
# install packages
pnpm i

# build everything
pnpm build:all
```

## Using `pnpm`

Add a new package to a workspace:

```bash
pnpm add solid-hcaptcha --filter @revolt/auth
```
