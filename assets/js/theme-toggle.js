const VALID_THEMES = new Set(["system", "light", "dark"]);

export function getStoredTheme(storage = globalThis.localStorage) {
  try {
    const theme = storage?.getItem("theme");
    return VALID_THEMES.has(theme) ? theme : "system";
  } catch {
    return "system";
  }
}

export function themeAttributeFor(theme) {
  return theme === "light" || theme === "dark" ? theme : null;
}

export function nextThemeState(theme) {
  const storedTheme = VALID_THEMES.has(theme) ? theme : "system";
  return {
    storedTheme,
    dataTheme: themeAttributeFor(storedTheme),
  };
}

function applyTheme(theme, { documentElement = document.documentElement, storage = localStorage } = {}) {
  const state = nextThemeState(theme);
  if (state.dataTheme) {
    documentElement.dataset.theme = state.dataTheme;
  } else {
    delete documentElement.dataset.theme;
  }
  storage.setItem("theme", state.storedTheme);
  return state;
}

function initThemeToggle() {
  const select = document.querySelector("[data-theme-toggle]");
  if (!select) return;

  select.value = getStoredTheme();
  select.addEventListener("change", () => {
    applyTheme(select.value);
  });
}

if (typeof document !== "undefined") {
  initThemeToggle();
}
