import { AppState } from "./state.js";
import { setDir, $$ } from "./dom.js";

export function applyLanguage() {
  setDir(AppState.lang);

  $$("[data-ar]").forEach(el => {
    el.textContent = el.dataset[AppState.lang];
  });
}

export function toggleLanguage() {
  AppState.lang = AppState.lang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", AppState.lang);
}