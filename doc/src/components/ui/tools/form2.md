# Using Form2

Form2 is the primary and recommended way to
handle any complex user input to request pipeline.

It is intended to supersede `<Form />` with the design goals of making form declarations a bit more involved to avoid complex implicit behaviours from forming, essentially following KISS philosophy.

@todo add information about how to display general errors!

In general, usage looks as follows:

```ts
// create your group using solid-forms
const group = createFormGroup({ .. });

// define your handler
// NB. can be a Promise<..>
async function yourSubmitHandler() {
  // do something with group.controls.<control>.value, ..

  if (somethingWrong) {
    throw "error";
    // mapAnyError() is called on this value
    // which is inserted into errors as 'error'
  }
}
```

Then create the form itself in the JSX code:

```ts
<form onSubmit={Form2.submitHandler(group, yourSubmitHandler)>
  // use a wrapper for TextField that implements control:
  <Form2.TextField
    name="name"
    control={group.controls.name}
    label={t('i18n.key')}
  />

  // implement your own button:
  <Button isDisabled={!editGroup.isDirty} type="submit">
    {t('action.submit')}
  </Button>
  // or use the provided one:
  <Form2.Submit group={editGroup}>
    {t('action.save')}
  </Form2.Submit>
</form>
```

There are examples provided throughout the code, just search for `<Form2` in the codebase.
