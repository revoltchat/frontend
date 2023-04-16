# Solid App (name TBD)

This is still a work in progress, please **do not create any issues** and clear any PRs with me ahead of time.

See [code style guidelines here](./GUIDELINES.md)!

## Setup locally

```bash
# Clone the repository and `cd` into it.
git clone --recursive https://github.com/revoltchat/frontend client
cd client

# Update submodules if you pull new changes.
# git submodule init && git submodule update

# Install all packages.
pnpm i

# Build dependencies.
pnpm build:deps
# Or build a specific dependency: (i.e. revolt.js updates)
# pnpm --filter revolt.js run build

# Run dev server for web client on http://local.revolt.chat:5173.
pnpm dev:web

# Run dev for desktop client.
pnpm dev:desktop
```

## Build

Check you've installed packages using `pnpm i`.

### Only web client

```bash
pnpm build:web # Will also run `build:deps`

# Or, for production, where assets are relative to `/app`.
pnpm build:web:prod
```

Build can be found under `/packages/client/dist`.

### Only desktop client

```bash
pnpm build:desktop
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
