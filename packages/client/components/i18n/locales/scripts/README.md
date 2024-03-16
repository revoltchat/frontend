# Revolt Translations Scripts

This folder contains various scripts useful for maintainers of this repository.

## Local setup

Right now, these scripts are still in development - however, you can get them running locally. You'll need Git and Node >=18 installed - in addition, you'll need to install Yarn Classic (I recommend using Corepack for this).

-   Clone the repository:

```bash
git clone "https://github.com/revoltchat/translations" translations && cd translations/scripts
```

-   Install the necessary dependencies:

```bash
yarn install
```

-   Copy `.env.example` to `.env`, then [create a GitHub personal access token](https://github.com/settings/tokens/new?scopes=repo) and paste it in the new file.
-   Compile and link the scripts:

```bash
yarn build && npm link
```

You should now be able to run the scripts:

```bash
translations-scripts help
```

If you make any changes to the scripts, **make sure to run `yarn build` before trying to run them** or your changes will **not** be reflected.
