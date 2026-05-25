import test from "node:test";
import assert from "node:assert/strict";

import { getStoredTheme, nextThemeState, themeAttributeFor, themeIconFor, themeLabelFor, themeAfter } from "../assets/js/theme-toggle.js";

test("getStoredTheme returns a valid stored theme", () => {
  const storage = new Map([["theme", "dark"]]);

  const result = getStoredTheme({ getItem: (key) => storage.get(key) });

  assert.equal(result, "dark");
});

test("getStoredTheme falls back to system for missing or invalid values", () => {
  assert.equal(getStoredTheme({ getItem: () => null }), "system");
  assert.equal(getStoredTheme({ getItem: () => "sepia" }), "system");
});

test("themeAttributeFor only returns explicit light or dark values", () => {
  assert.equal(themeAttributeFor("light"), "light");
  assert.equal(themeAttributeFor("dark"), "dark");
  assert.equal(themeAttributeFor("system"), null);
});

test("nextThemeState returns DOM and storage actions", () => {
  assert.deepEqual(nextThemeState("light"), {
    storedTheme: "light",
    dataTheme: "light",
  });
  assert.deepEqual(nextThemeState("system"), {
    storedTheme: "system",
    dataTheme: null,
  });
});

test("themeAfter cycles system to light to dark to system", () => {
  assert.equal(themeAfter("system"), "light");
  assert.equal(themeAfter("light"), "dark");
  assert.equal(themeAfter("dark"), "system");
  assert.equal(themeAfter("bad-value"), "system");
});

test("theme button labels and icons describe the active theme", () => {
  assert.equal(themeLabelFor("system"), "Theme: System");
  assert.equal(themeLabelFor("light"), "Theme: Light");
  assert.equal(themeLabelFor("dark"), "Theme: Dark");
  assert.match(themeIconFor("system"), /theme-icon-system/);
  assert.match(themeIconFor("light"), /theme-icon-light/);
  assert.match(themeIconFor("dark"), /theme-icon-dark/);
});
