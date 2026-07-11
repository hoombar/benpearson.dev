const searchInput = document.querySelector("[data-activity-search]");
const cards = Array.from(document.querySelectorAll("[data-activity-card]"));
const count = document.querySelector("[data-activity-count]");
const ageMinInput = document.querySelector("[data-age-min]");
const ageMaxInput = document.querySelector("[data-age-max]");
const ageLabel = document.querySelector("[data-age-label]");
const durationMinInput = document.querySelector("[data-duration-min]");
const durationMaxInput = document.querySelector("[data-duration-max]");
const durationLabel = document.querySelector("[data-duration-label]");
const indoorFilter = document.querySelector("[data-indoor-filter]");
const outdoorFilter = document.querySelector("[data-outdoor-filter]");

if (cards.length) {
  const filterInputs = [
    searchInput,
    ageMinInput,
    ageMaxInput,
    durationMinInput,
    durationMaxInput,
    indoorFilter,
    outdoorFilter,
  ].filter(Boolean);

  for (const input of filterInputs) {
    input.addEventListener("input", applyFilters);
    input.addEventListener("change", applyFilters);
  }

  applyFilters();
}

function applyFilters() {
  const ageRange = normalisedRange(ageMinInput, ageMaxInput);
  const durationRange = normalisedRange(durationMinInput, durationMaxInput);
  const terms = parseSearchTerms(searchInput?.value ?? "");
  const showIndoor = indoorFilter?.checked ?? true;
  const showOutdoor = outdoorFilter?.checked ?? true;
  let visible = 0;

  updateLabels(ageRange, durationRange);

  for (const card of cards) {
    const text = card.dataset.searchText ?? "";
    const activityAge = {
      min: Number(card.dataset.ageMin ?? 0) / 12,
      max: Number(card.dataset.ageMax ?? 99) / 12,
    };
    const activityDuration = {
      min: Number(card.dataset.durationMin ?? 0),
      max: Number(card.dataset.durationMax ?? 99),
    };
    const location = card.dataset.location;
    const matches = terms.include.every((term) => text.includes(term))
      && terms.exclude.every((term) => !text.includes(term))
      && rangesOverlap(activityAge, ageRange)
      && rangesOverlap(activityDuration, durationRange)
      && ((location === "indoor" && showIndoor) || (location === "outdoor" && showOutdoor));

    card.hidden = !matches;
    if (matches) visible += 1;
  }

  if (count) {
    count.textContent = `${visible} ${visible === 1 ? "activity" : "activities"}`;
  }
}

function parseSearchTerms(value) {
  return value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reduce((terms, term) => {
      if (term.startsWith("-") && term.length > 1) {
        terms.exclude.push(term.slice(1));
      } else {
        terms.include.push(term);
      }

      return terms;
    }, { include: [], exclude: [] });
}

function normalisedRange(minInput, maxInput) {
  const rawMin = Number(minInput?.value ?? minInput?.min ?? 0);
  const rawMax = Number(maxInput?.value ?? maxInput?.max ?? rawMin);
  return {
    min: Math.min(rawMin, rawMax),
    max: Math.max(rawMin, rawMax),
  };
}

function rangesOverlap(a, b) {
  return a.max >= b.min && a.min <= b.max;
}

function updateLabels(ageRange, durationRange) {
  if (ageLabel) {
    ageLabel.textContent = ageRange.min === ageRange.max
      ? `Age ${ageRange.min}`
      : `Ages ${ageRange.min}-${ageRange.max}`;
  }

  if (durationLabel) {
    if (durationRange.min === 0 && durationRange.max === 2) {
      durationLabel.textContent = "Any duration";
    } else if (durationRange.min === durationRange.max) {
      durationLabel.textContent = `${durationRange.min} ${durationRange.min === 1 ? "hour" : "hours"}`;
    } else {
      durationLabel.textContent = `${durationRange.min}-${durationRange.max} hours`;
    }
  }
}
