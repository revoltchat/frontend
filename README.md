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

# run whenever revolt.js dependency updates
pnpm --filter revolt.js run build

# run dev server
pnpm run dev
```

Now navigate to http://local.revolt.chat:5173

## Using `pnpm`

Add a new package to a workspace:

```bash
pnpm add solid-hcaptcha --filter @revolt/auth
```
