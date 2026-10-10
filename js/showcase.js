// Rotating showcase on the home page.
// Edit these two lists to choose what rotates. The first items are the ones
// shown when the page loads; the rest wait in a queue and swap in one slot at
// a time, so the same item is never on screen twice.

const bestProjects = [
  { href: "brand/service-rockwell.html", image: "brand/images/studio-5000-l5x-automation.webp", alt: "Studio 5000 L5X automation interface", tag: "Controls", title: "Excel exports from electrical schemas into PLC code" },
  { href: "brand/project-avionics.html", image: "brand/images/aviation-hud-prototype.webp", alt: "General aviation head-up display prototype on a test bench", tag: "Avionics", title: "Everything a pilot needs, in front of his eyes. Custom built." },
  { href: "brand/service-excel.html", image: "brand/images/course-management-webapp.webp", alt: "Training and safety course management web app that replaced a complex spreadsheet", tag: "Excel", title: "Complex Excel into web apps that are easy to maintain" },
  { href: "brand/service-docx.html", image: "brand/images/technical-translation-review.webp", alt: "Technical translation review with source and translated terms", tag: "Documents", title: "Translations preserving docx structure" },
  { href: "brand/service-workflows.html", image: "brand/images/excel-approval-workflow.webp", alt: "Custom app for company documents: Word, Excel, PDF, and Eplan", tag: "Operations", title: "Custom app for documents (word, excel, pdf, eplan)" },
  { href: "brand/service-local-ai.html", image: "brand/images/local-ai-vllm-platform.webp", alt: "Local AI inference platform running on company-controlled hardware", tag: "Local AI", title: "Local AI systems" },
];

const bestPhotos = [
  { image: "portfolio/S%20(15).jpg", alt: "Lake shore at dusk under a pink sky, mountains in the distance" },
  { image: "portfolio/S%20(13).jpg", alt: "Wooden pier on a lake under a red sunset" },
  { image: "portfolio/S%20(25).jpg", alt: "Coastal town lit up at blue hour, seen through a stone arch" },
  { image: "portfolio/S%20(27).jpg", alt: "Blue race car cornering on a red and white kerb" },
  { image: "portfolio/S%20(8).jpg", alt: "Mountain village at night with fog in the valley" },
  { image: "portfolio/S%20(19).jpg", alt: "Fishing boats along a canal on a foggy morning" },
  { image: "portfolio/S%20(23).jpg", alt: "Painted lady butterfly on purple buddleia flowers" },
  { image: "portfolio/S%20(26).jpg", alt: "Mountain lake framed by leaves" },
  { image: "portfolio/S%20(18).jpg", alt: "Pale mushrooms in green moss" },
  { image: "portfolio/S%20(28).jpg", alt: "Town with a domed church at dusk, mountains on the horizon" },
];

const FADE_MS = 450;

const renderers = {
  // <img> slot: only the picture changes
  image(slot, item) {
    slot.src = item.image;
    slot.alt = item.alt;
  },
  // <a class="card"> slot: link, picture, tag and title change
  project(slot, item) {
    slot.href = item.href;
    const img = slot.querySelector("img");
    img.src = item.image;
    img.alt = item.alt;
    slot.querySelector(".tag").textContent = item.tag;
    slot.querySelector("h3").textContent = item.title;
  },
};

function rotate(pool, slots, interval) {
  if (!slots.length) return;
  const visible = pool.slice(0, slots.length);
  const queue = pool.slice(slots.length);
  slots.forEach((slot, i) => visible[i] && renderers[slot.dataset.rotate](slot, visible[i]));
  if (!queue.length) return;

  // Hovering or focusing a slot pauses its group, so nothing moves under the pointer.
  let paused = false;
  slots.forEach((slot) => {
    const hoverTarget = slot.closest("a") || slot;
    hoverTarget.addEventListener("mouseenter", () => (paused = true));
    hoverTarget.addEventListener("mouseleave", () => (paused = false));
    hoverTarget.addEventListener("focusin", () => (paused = true));
    hoverTarget.addEventListener("focusout", () => (paused = false));
  });

  let next = 0;
  setInterval(() => {
    if (paused || document.hidden) return;
    const i = next;
    next = (next + 1) % slots.length;
    const incoming = queue.shift();
    queue.push(visible[i]);
    visible[i] = incoming;

    // Load the new picture first so the slot never fades into a blank frame.
    const preload = new Image();
    preload.src = incoming.image;
    preload.decode().then(() => {
      slots[i].classList.add("is-fading");
      setTimeout(() => {
        renderers[slots[i].dataset.rotate](slots[i], incoming);
        slots[i].classList.remove("is-fading");
      }, FADE_MS);
    }, () => {});
  }, interval);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  rotate(bestProjects, [...document.querySelectorAll("[data-pool='projects']")], 3500);
  rotate(bestPhotos, [...document.querySelectorAll("[data-pool='photos']")], 3000);
}
