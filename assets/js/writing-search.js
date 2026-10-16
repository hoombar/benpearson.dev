const controls = document.querySelector("[data-writing-controls]");
const searchInput = document.querySelector("[data-writing-search]");
const clearButton = document.querySelector("[data-writing-clear]");
const cards = Array.from(document.querySelectorAll("[data-writing-card]"));
const list = document.querySelector("[data-writing-list]");
const count = document.querySelector("[data-writing-count]");
const emptyMessage = document.querySelector("[data-writing-empty]");

if (controls && searchInput && clearButton && list && count && emptyMessage) {
  function applyFilters() {
    const terms = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const card of cards) {
      const text = card.dataset.searchText ?? "";
      const matches = terms.every((term) => text.includes(term));
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    count.textContent = `${visible} ${visible === 1 ? "article" : "articles"}`;
    emptyMessage.hidden = visible !== 0;
    list.hidden = visible === 0;
    clearButton.disabled = searchInput.value.length === 0;
  }

  searchInput.addEventListener("input", applyFilters);
  searchInput.addEventListener("search", applyFilters);
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
    searchInput.focus();
  });

  applyFilters();
  controls.hidden = false;
}
