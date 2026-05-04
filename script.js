const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const themeToggle = $(".theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (preferredDark ? "dark" : "light");

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    if (themeToggle) themeToggle.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}"></i>`;
    themeToggle?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    if (window.lucide) window.lucide.createIcons();
  };

  applyTheme(initialTheme);
  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });

  const cursor = $(".cursor-dot");
  window.addEventListener("pointermove", (event) => {
    if (!cursor) return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  $$(".magnet, button, a").forEach((element) => {
    element.addEventListener("pointerenter", () => cursor?.classList.add("is-hovering"));
    element.addEventListener("pointerleave", () => cursor?.classList.remove("is-hovering"));
  });

  const progress = $(".scroll-progress span");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${Math.min((window.scrollY / max) * 100, 100)}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        $$(".rail-link, .main-nav a").forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", isMatch);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  $$("[data-section]").forEach((section) => sectionObserver.observe(section));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const number = entry.target;
        const target = Number(number.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 54));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          number.textContent = `${current}${number.dataset.suffix || ""}`;
        }, 22);
        countObserver.unobserve(number);
      });
    },
    { threshold: 0.8 }
  );
  $$("[data-count]").forEach((number) => countObserver.observe(number));

  const menuToggle = $(".menu-toggle");
  const nav = $(".main-nav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  $$(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", String(item === tab));
      });
      $$(".tab-panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === tab.dataset.tab);
      });
    });
  });

  $$(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
      const filter = button.dataset.filter;
      $$(".project-card").forEach((card) => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  const modal = $(".project-modal");
  $$(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      $("img", modal).src = $("img", card).src;
      $("img", modal).alt = $("img", card).alt;
      $("#modal-title", modal).textContent = card.dataset.title;
      $(".modal-copy", modal).textContent = card.dataset.copy;
      $(".modal-tools", modal).innerHTML = card.dataset.tools
        .split(",")
        .map((tool) => `<span>${tool.trim()}</span>`)
        .join("");
      modal.showModal();
    });
  });
  $(".modal-close")?.addEventListener("click", () => modal.close());
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  let slideIndex = 0;
  const slides = $$(".testimonial");
  const showSlide = (nextIndex) => {
    slideIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === slideIndex));
  };
  $$("[data-slide]").forEach((button) => {
    button.addEventListener("click", () => showSlide(slideIndex + (button.dataset.slide === "next" ? 1 : -1)));
  });
  setInterval(() => showSlide(slideIndex + 1), 5200);

  $$(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("is-open");
      const icon = $("svg", item);
      if (icon) icon.style.transform = item.classList.contains("is-open") ? "rotate(45deg)" : "rotate(0)";
    });
  });

  $$(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  $(".contact-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = $("button", form);
    const status = $(".form-status", form);
    const original = button.innerHTML;

    button.disabled = true;
    button.innerHTML = '<i data-lucide="loader-circle"></i> Sending...';
    status.textContent = "";
    status.className = "form-status";
    if (window.lucide) window.lucide.createIcons();

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      status.textContent = "Message sent. Please check your email once to activate FormSubmit if this is the first message.";
      status.classList.add("is-success");
      button.innerHTML = '<i data-lucide="check"></i> Sent';
    } catch (error) {
      status.textContent = "Message could not be sent right now. Please try again.";
      status.classList.add("is-error");
      button.innerHTML = original;
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
  });
});
