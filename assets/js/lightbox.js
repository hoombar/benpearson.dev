const overlay = document.createElement("div");
overlay.className = "lightbox";
overlay.setAttribute("role", "dialog");
overlay.setAttribute("aria-modal", "true");
overlay.setAttribute("aria-label", "Image preview");
const overlayImg = document.createElement("img");
overlay.appendChild(overlayImg);
document.body.appendChild(overlay);

function openLightbox(image) {
  overlayImg.src = image.currentSrc || image.src;
  overlayImg.alt = image.alt || "";
  overlay.classList.add("open");
}

function closeLightbox() {
  overlay.classList.remove("open");
}

document.addEventListener("click", (event) => {
  if (overlay.classList.contains("open")) {
    closeLightbox();
    return;
  }
  const image = event.target.closest?.(".article-body img");
  if (image) openLightbox(image);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
