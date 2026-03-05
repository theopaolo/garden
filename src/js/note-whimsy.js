const CARD_VARIANTS = [
  "card-variant-iris",
  "card-variant-coral",
  "card-variant-mint",
  "card-variant-sky",
  "card-variant-honey",
  "card-variant-rose",
];

function stableHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function applyWhimsyCards(root = document) {
  const cards = root.querySelectorAll(".note-item");

  cards.forEach((card, index) => {
    const href = card.getAttribute("href") || "";
    const key = href || `${card.textContent?.trim() || "note"}|${index}`;
    const hash = stableHash(key);
    const variant = CARD_VARIANTS[hash % CARD_VARIANTS.length];

    card.classList.remove(...CARD_VARIANTS);
    card.classList.add(variant);
    card.style.setProperty("--card-accent-x", `${10 + (hash % 55)}%`);
    card.style.setProperty("--card-noise-opacity", (0.05 + ((hash % 4) * 0.015)).toFixed(3));
  });
}

function enhanceNoteImages(root = document) {
  const images = root.querySelectorAll(".note-content img");

  images.forEach((image) => {
    if (image.closest("figure")) {
      return;
    }

    const figure = document.createElement("figure");
    const parent = image.parentElement;
    const isStandaloneImageParagraph =
      parent &&
      parent.tagName === "P" &&
      parent.children.length === 1 &&
      parent.textContent.trim() === "";

    if (isStandaloneImageParagraph) {
      parent.parentNode.insertBefore(figure, parent);
      figure.appendChild(image);
      parent.remove();
    } else {
      image.parentNode.insertBefore(figure, image);
      figure.appendChild(image);
    }

    const altText = image.getAttribute("alt")?.trim();
    if (altText) {
      const caption = document.createElement("figcaption");
      caption.textContent = altText;
      figure.appendChild(caption);
    }
  });
}

function queueWhimsyCards() {
  window.requestAnimationFrame(() => {
    applyWhimsyCards(document);
    enhanceNoteImages(document);
  });
}

document.addEventListener("DOMContentLoaded", queueWhimsyCards);
document.addEventListener("garden:page-updated", queueWhimsyCards);
