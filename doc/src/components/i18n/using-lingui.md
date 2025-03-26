# Using Lingui

Import the macro package wherever you wish to use Lingui, prefer to use the JSX syntax:

```typescript
import { Trans } from '@lingui-solid/solid/macro';

<Trans>Hi, I am a string!</Trans>

<Trans>There are {5} users in queue.</Trans>
```

But if necessary, you can use the hook where strings are needed:

```typescript
import { useLingui } from "@lingui-solid/solid/macro";

const { t } = useLingui();

t`Hello, chat!`;

t`There are {3} people in your walls.`;
```

## Updating source catalog

```bash
pnpm --filter client lingui
```

this will be done by a mantainer once your pr is merged :)
