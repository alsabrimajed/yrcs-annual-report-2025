import { AppState } from "./state.js";
import { loadData } from "./data.js";
import { applyLanguage, toggleLanguage } from "./i18n.js";
import { renderAll } from "./renderers.js";

window.toggleLanguage = () => {
  toggleLanguage();
  applyLanguage();
  renderAll();
};

(async function init() {
  await loadData();
  applyLanguage();
  renderAll();
})();