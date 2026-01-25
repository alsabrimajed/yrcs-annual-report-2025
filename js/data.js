import { AppState } from "./state.js";

export async function loadData() {
  try {
    toggleLoading(true);

    const res = await fetch("data.json");
    if (!res.ok) throw new Error("Data load failed");

    AppState.data = await res.json();
  } catch (e) {
    console.error(e);
    showError();
  } finally {
    toggleLoading(false);
  }
}

function toggleLoading(show) {
  document.getElementById("loading-overlay").style.display = show ? "flex" : "none";
}

function showError() {
  document.getElementById("error-message").style.display = "block";
}