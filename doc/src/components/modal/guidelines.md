# General Guidelines

This needs expanding on, but some key points!

- `types.ts` contains all the type information for modals
- `modals.tsx` contains all the component mounting code
- `modals/*.tsx` are all the individual modals
- All modals should use the `Dialog` component except in special circumstance
- If you take user input, use [Form2](../ui/tools/form2.md) (ex. EditUsername)
- If you are performing an action, use Tanstack Mutations (ex. ChannelToggleMature) \
  NB. take care to use `mutateAsync` instead of `mutate` to keep dialog open while pending \
  NB. bind `onError` to `showError` from `useModals()`
- **Do not mix** Tanstack and Form2, you're either using one or the other \
  They both provide the necessary UX flows, e.g. 'pending' actions

Your action `onClick` handlers can return one of the following:

- A `Promise<any>` which on resolution will close the dialog, otherwise will do nothing.
- A non-`false` value which will close the dialog.
- The value `false` which will prevent the dialog from closing.
