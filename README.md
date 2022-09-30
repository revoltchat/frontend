Configure dev env

```
nvm i 18.10.0
npm i -g pnpm
```

Run the client locally (Access it via http://local.revolt.chat:5173)

```
git clone https://github.com/insertish/revoltchat-solid-client-monorepo
git submodule init
git submodule update
pnpm i
pnpm build
pnpm dev
```

Add a new package to a workspace

```
pnpm add solid-hcaptcha --filter @revolt/auth
```
