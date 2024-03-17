# Solid App (name TBD)

This is still a work in progress, please **do not create any issues** and clear any PRs with me ahead of time.

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
git -c submodule."packages/client/public/assets".update=checkout submodule update packages/client/public/assets
```

You can switch back to fallback assets by running deinit and continuing as normal:

```bash
# deinit submodule which clears directory
git submodule deinit packages/client/public/assets
```

If you are using fallback assets and want to switch back:

```bash
# remove symlink
rm packages/client/public/assets

# create directory
mkdir packages/client/public/assets

# reinit the submodule if not already
git submodule init packages/client/public/assets

# now run the first command
```

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
