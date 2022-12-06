# Integration Testing Revolt

[Playwright](https://playwright.dev/) is used for end-to-end integration testing and UI regression tests.

## Set Up

To get ready to use Playwright, run the following:

```bash
pushd packages/browser-test-runner
pnpm exec playwright install
popd
```

## Run UI regression tests

To run the UI regression tests, first start the showcase server:

```bash
pnpm showcase &
```

Now run the tests:

```bash
pushd packages/browser-test-runner
# run regression tests
pnpm exec playwright test regression

# show the HTML report
pnpm exec playwright show-report
popd
```
