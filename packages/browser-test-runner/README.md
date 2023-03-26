# Integration Testing Revolt

[Playwright](https://playwright.dev/) is used for end-to-end integration testing and UI regression tests.

## Set Up

To get ready to use Playwright, run the following:

```bash
pnpm run test:browser:install
```

## Run UI regression tests

To run the UI regression tests, first start the showcase server:

```bash
pnpm showcase &
```

Now run the tests:

```bash
# run regression tests
pnpm run test:browser:regression

# show the HTML report
pnpm run test:browser:report
```
