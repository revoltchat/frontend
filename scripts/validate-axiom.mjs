#!/usr/bin/env node
/**
 * Axiom standalone source smoke checks.
 *
 * These checks intentionally do not resolve npm dependencies or Git submodules.
 * They are a *supplement* to (not a replacement for) the full Stoat build.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(repositoryRoot, path), "utf8");
const check = (name, fn) => {
  try {
    fn();
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    process.stderr.write(`FAIL ${name}: ${error.message}\n`);
    process.exitCode = 1;
  }
};

check("Axiom app root activates scoped theme", () => {
  const shell = read("packages/client/src/Interface.tsx");
  assert.match(shell, /import ["']\.\/axiom-theme\.css["']/);
  assert.match(shell, /class="app_root axiom-theme"/);
});

check("Axiom navigation and message hooks stay connected", () => {
  const base = "packages/client/";
  for (const [path, marker] of [
    ["src/interface/navigation/servers/ServerList.tsx", "axiom-server-rail"],
    ["src/interface/navigation/channels/HomeSidebar.tsx", "axiom-channel-sidebar"],
    ["src/interface/navigation/channels/ServerSidebar.tsx", "axiom-channel-sidebar"],
    ["components/ui/components/features/messaging/elements/Container.tsx", "axiom-message"],
    ["components/ui/components/features/messaging/elements/Attachment.tsx", "axiom-attachment"],
    ["components/ui/components/features/messaging/composition/MessageBox.tsx", "axiom-composer"],
  ]) {
    assert.ok(read(base + path).includes(marker), `Missing ${marker} in ${path}`);
  }
});

check("Auth and settings have separate Axiom styling hooks", () => {
  const auth = read("packages/client/components/auth/src/AuthPage.tsx");
  const settings = read("packages/client/components/modal/modals/Settings.tsx");
  const entry = read("packages/client/src/index.tsx");
  assert.ok(auth.includes("axiom-auth"));
  assert.ok(auth.includes("axiom-wordmark"));
  assert.ok(!auth.includes("<AppUpsell"));
  assert.ok(settings.includes("axiom-settings-overlay"));
  assert.ok(entry.includes('import "./axiom-brand.css"'));
});

check("CSS files include focus and motion accessibility", () => {
  const theme = read("packages/client/src/axiom-theme.css");
  const brand = read("packages/client/src/axiom-brand.css");
  for (const [name, css] of [["theme", theme], ["brand", brand]]) {
    assert.match(css, /:focus-visible/);
    assert.match(css, /prefers-reduced-motion/);
    assert.ok(css.includes(".axiom-"), `Missing Axiom-scoped rules in ${name}`);
  }
});

check("Axiom metadata and icon point to owned assets", () => {
  const html = read("packages/client/index.html");
  const vite = read("packages/client/vite.config.ts");
  assert.match(html, /<title>Axiom<\/title>/);
  assert.match(html, /href="\/axiom-icon\.svg"/);
  assert.match(vite, /name: "Axiom"/);
  assert.match(vite, /short_name: "Axiom"/);
  assert.match(vite, /axiom-icon\.svg/);
  const iconPath = "packages/client/public/axiom-icon.svg";
  assert.ok(existsSync(resolve(repositoryRoot, iconPath)));
  assert.match(read(iconPath), /<svg[\s>]/);
});

check("Upstream license and legal policy handoff are documented", () => {
  const doc = read("docs/AXIOM_FOUNDATION.md");
  assert.match(doc, /license/i);
  assert.match(doc, /legal links/i);
});

if (process.exitCode) {
  process.stderr.write("Axiom smoke checks failed.\n");
} else {
  process.stdout.write("Axiom source checks passed (not a full build).\n");
}
