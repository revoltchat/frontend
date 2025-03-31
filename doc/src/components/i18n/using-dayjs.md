# Using Dayjs

To use localised dayjs functions (or use any imported plugin), use the time hook:

```typescript
import { useTime } from "@revolt/i18n";

function Component() {
  const dayjs = useTime();

  return <span>Time at initial render: {dayjs().format("LT")}</span>
}
```
