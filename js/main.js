(function () {
  const courses = window.ACACODE_COURSES || [];

  /* Mobile nav */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Render course cards */
  function cardHTML(course) {
    return `
      <article class="course-card reveal" data-category="${course.category}">
        <a class="course-card__thumb" href="${course.href}">
          <img src="${course.image}" alt="${course.title}" loading="lazy" />
        </a>
        <div class="course-card__body">
          <span class="course-card__cat">${course.category}</span>
          <h3><a href="${course.href}">${course.title}</a></h3>
          <p>${course.blurb}</p>
          <div class="course-card__meta">
            <span>${course.hours}</span>
          </div>
          <a class="btn btn--primary" href="${course.href}">Ver</a>
        </div>
      </article>
    `;
  }

  const grid = document.getElementById("coursesGrid");
  if (grid) {
    const homeCourses = courses.slice(0, 8);
    grid.innerHTML = homeCourses.map(cardHTML).join("");
  }

  const allGrid = document.getElementById("allCoursesGrid");
  if (allGrid) {
    allGrid.innerHTML = courses.map(cardHTML).join("");
  }

  /* Category filters on cursos.html */
  const filters = document.getElementById("courseFilters");
  if (filters && allGrid) {
    const cats = ["Todos", ...new Set(courses.map((c) => c.category))];
    filters.innerHTML = cats
      .map(
        (cat, i) =>
          `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${cat}">${cat}</button>`
      )
      .join("");

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const value = btn.dataset.filter;
      allGrid.querySelectorAll(".course-card").forEach((card) => {
        const show = value === "Todos" || card.dataset.category === value;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* Hero slider (fade como acacode.com / slick) */
  const slides = [...document.querySelectorAll(".slider__item")];
  const dots = [...document.querySelectorAll(".slider__dot")];
  let slideIndex = 0;
  let slideTimer;

  function goSlide(i) {
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === slideIndex));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === slideIndex));
  }

  function startSlider() {
    stopSlider();
    slideTimer = setInterval(() => goSlide(slideIndex + 1), 5000);
  }

  function stopSlider() {
    if (slideTimer) clearInterval(slideTimer);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goSlide(Number(dot.dataset.go));
      startSlider();
    });
  });

  const heroPrev = document.getElementById("heroPrev");
  const heroNext = document.getElementById("heroNext");
  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      goSlide(slideIndex - 1);
      startSlider();
    });
  }
  if (heroNext) {
    heroNext.addEventListener("click", () => {
      goSlide(slideIndex + 1);
      startSlider();
    });
  }

  if (slides.length) startSlider();

  /* Testimonials */
  const testimonials = [...document.querySelectorAll(".testimonial")];
  let testiIndex = 0;

  function goTesti(i) {
    if (!testimonials.length) return;
    testiIndex = (i + testimonials.length) % testimonials.length;
    testimonials.forEach((t, idx) => t.classList.toggle("is-active", idx === testiIndex));
  }

  const prev = document.getElementById("testiPrev");
  const next = document.getElementById("testiNext");
  if (prev) prev.addEventListener("click", () => goTesti(testiIndex - 1));
  if (next) next.addEventListener("click", () => goTesti(testiIndex + 1));
  if (testimonials.length) {
    setInterval(() => goTesti(testiIndex + 1), 7000);
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Counters */
  const counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }
})();
