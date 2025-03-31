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
    // inserted into errors as 'error'
  }
}

// define a handler to reset the form (if you need this functionality)
function onReset() {
  // group.controls.<control>.setValue(/* whatever it should be / now is */)
}
```

Then create the form itself in the JSX code:

```ts
<form onSubmit={Form2.submitHandler(group, yourSubmitHandler, onReset)}>
  // use a wrapper for TextField that implements control:
  <Form2.TextField
    name="name"
    control={group.controls.name}
    label={t("i18n.key")}
  />
  // include an image picker:
  <Form2.FileInput control={group.controls.icon} accept="image/*" />
  // use the provided buttons for best integration:
  <Row>
    // if appropriate, allow the user to reset the form back to original state
    <Form2.Reset group={editGroup} onReset={onReset} />
    // in-built submission button:
    <Form2.Submit group={editGroup}>
      <Trans>Save</Trans>
    </Form2.Submit>
    // you should also indicate when submission is pending:
    <Show when={editGroup.isPending}>
      <CircularProgress />
    </Show>
  </Row>
</form>
```

There are examples provided throughout the code, just search for `<Form2` in the codebase.
