// Theme, navigation, small motion effects, and accessible contact-form feedback.
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const typedText = document.querySelector(".typed-text");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    // Theme switching still works when browser storage is unavailable.
  }
}

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    setTheme("light");
  }
} catch (error) {
  themeToggle.setAttribute("aria-label", "Switch to light mode");
}

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "light" ? "dark" : "light");
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  }
});

const year = document.querySelector(".footer-year");
year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (typedText && !prefersReducedMotion) {
  const phrases = ["Full Stack Developer", "Python Developer", "Problem Solver"];
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = true;

  const typeNextCharacter = () => {
    const phrase = phrases[phraseIndex];
    characterIndex += deleting ? -1 : 1;
    typedText.textContent = phrase.slice(0, characterIndex);

    let delay = deleting ? 55 : 95;
    if (characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    } else if (characterIndex === phrases[phraseIndex].length) {
      deleting = true;
      delay = 1400;
    }

    window.setTimeout(typeNextCharacter, delay);
  };

  window.setTimeout(typeNextCharacter, 1800);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.classList.remove("is-error", "is-success");

    if (!contactForm.reportValidity()) {
      formStatus.textContent = "Please check the highlighted fields and try again.";
      formStatus.classList.add("is-error");
      return;
    }

    const formData = new FormData(contactForm);
    const subject = `Portfolio inquiry from ${formData.get("name")}`;
    const body = `${formData.get("message")}\n\nFrom: ${formData.get("name")}\nEmail: ${formData.get("email")}`;
    const email = document.querySelector(".contact-email").getAttribute("href").replace(/^mailto:/, "").trim();
    if (!email || email === "hello@yourdomain.com") {
      formStatus.textContent = "Your message is ready. Update the contact email in index.html to enable sending.";
      formStatus.classList.add("is-error");
      return;
    }

    formStatus.textContent = "Opening your email app with the message details.";
    formStatus.classList.add("is-success");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
