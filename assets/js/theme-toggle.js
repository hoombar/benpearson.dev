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

export function themeAfter(theme) {
  if (theme === "system") return "light";
  if (theme === "light") return "dark";
  if (theme === "dark") return "system";
  return "system";
}

export function themeLabelFor(theme) {
  const labels = {
    system: "Theme: System",
    light: "Theme: Light",
    dark: "Theme: Dark",
  };
  return labels[VALID_THEMES.has(theme) ? theme : "system"];
}

export function themeIconFor(theme) {
  if (theme === "light") {
    return '<svg class="theme-icon theme-icon-light" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M6.7 6.7 4.9 4.9m14.2 14.2-1.8-1.8m0-10.6 1.8-1.8M4.9 19.1l1.8-1.8"/><circle cx="12" cy="12" r="4.25"/></svg>';
  }
  if (theme === "dark") {
    return '<svg class="theme-icon theme-icon-dark" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.2 15.6A8.5 8.5 0 0 1 8.4 3.8a8.5 8.5 0 1 0 11.8 11.8Z"/></svg>';
  }
  return '<svg class="theme-icon theme-icon-system" aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M9 20h6m-3-4v4"/></svg>';
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

function renderThemeButton(button, theme) {
  button.dataset.themeValue = theme;
  button.setAttribute("aria-label", themeLabelFor(theme));
  button.setAttribute("title", themeLabelFor(theme));
  button.innerHTML = themeIconFor(theme);
}

function initThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  renderThemeButton(button, getStoredTheme());
  button.addEventListener("click", () => {
    const state = applyTheme(themeAfter(button.dataset.themeValue));
    renderThemeButton(button, state.storedTheme);
  });
}

if (typeof document !== "undefined") {
  initThemeToggle();
}
