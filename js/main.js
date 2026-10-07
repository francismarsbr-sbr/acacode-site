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

  /* Guías PDF — grid, búsqueda y filtros */
  const guides = window.ACACODE_GUIAS || [];
  const guidesGrid = document.getElementById("guidesGrid");
  const guidesFilters = document.getElementById("guidesFilters");
  const guidesSearch = document.getElementById("guidesSearch");
  const guidesEmpty = document.getElementById("guidesEmpty");
  let activeGuideCategory = "Todos";

  function guideCardHTML(guide) {
    const fileName = guide.file.split("/").pop();
    return `
      <article class="guide-card reveal" data-category="${guide.category}" data-search="${guide.title} ${guide.category} ${guide.description}">
        <span class="guide-card__badge">${guide.category}</span>
        <h3>${guide.title}</h3>
        <p>${guide.description}</p>
        <span class="guide-card__meta">PDF · ${guide.size}</span>
        <a class="btn btn--primary" href="${guide.file}" download="${fileName}">Descargar Guía</a>
      </article>
    `;
  }

  function applyGuideFilters() {
    if (!guidesGrid) return;
    const query = (guidesSearch?.value || "").trim().toLowerCase();
    let visible = 0;
    guidesGrid.querySelectorAll(".guide-card").forEach((card) => {
      const catOk =
        activeGuideCategory === "Todos" || card.dataset.category === activeGuideCategory;
      const searchOk =
        !query || (card.dataset.search || "").toLowerCase().includes(query);
      const show = catOk && searchOk;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    if (guidesEmpty) guidesEmpty.hidden = visible > 0;
  }

  if (guidesGrid) {
    guidesGrid.innerHTML = guides.map(guideCardHTML).join("");

    if (guidesFilters) {
      const cats = ["Todos", ...new Set(guides.map((g) => g.category))];
      guidesFilters.innerHTML = cats
        .map(
          (cat, i) =>
            `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${cat}">${cat}</button>`
        )
        .join("");

      guidesFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        guidesFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        activeGuideCategory = btn.dataset.filter;
        applyGuideFilters();
      });
    }

    if (guidesSearch) {
      guidesSearch.addEventListener("input", applyGuideFilters);
    }
  }

  /* Videos YouTube — grid, búsqueda y filtros */
  const videos = window.ACACODE_VIDEOS || [];
  const videosGrid = document.getElementById("videosGrid");
  const videosFilters = document.getElementById("videosFilters");
  const videosSearch = document.getElementById("videosSearch");
  const videosEmpty = document.getElementById("videosEmpty");
  let activeVideoCategory = "Todos";

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function videoCardHTML(video) {
    const isShort = video.type === "Short";
    const watchUrl = isShort
      ? `https://www.youtube.com/shorts/${video.id}`
      : `https://www.youtube.com/watch?v=${video.id}`;
    const thumb = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    const searchBlob = `${video.title} ${video.category} ${video.type} ${video.description}`;
    return `
      <article class="video-card reveal" data-category="${escapeAttr(video.category)}" data-search="${escapeAttr(searchBlob)}">
        <a class="video-card__thumb" href="${watchUrl}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${escapeAttr(video.title)}">
          <img src="${thumb}" alt="" loading="lazy" />
          <div class="video-card__play" aria-hidden="true"><span>▶</span></div>
        </a>
        <div class="video-card__body">
          <div class="video-card__badges">
            <span class="video-card__badge">${escapeAttr(video.category)}</span>
            <span class="video-card__badge video-card__badge--type">${escapeAttr(video.type)}</span>
          </div>
          <h3><a href="${watchUrl}" target="_blank" rel="noopener noreferrer">${escapeAttr(video.title)}</a></h3>
          <p>${escapeAttr(video.description)}</p>
          <a class="btn btn--primary" href="${watchUrl}" target="_blank" rel="noopener noreferrer">Ver en YouTube</a>
        </div>
      </article>
    `;
  }

  function applyVideoFilters() {
    if (!videosGrid) return;
    const query = (videosSearch?.value || "").trim().toLowerCase();
    let visible = 0;
    videosGrid.querySelectorAll(".video-card").forEach((card) => {
      const catOk =
        activeVideoCategory === "Todos" || card.dataset.category === activeVideoCategory;
      const searchOk =
        !query || (card.dataset.search || "").toLowerCase().includes(query);
      const show = catOk && searchOk;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    if (videosEmpty) videosEmpty.hidden = visible > 0;
  }

  if (videosGrid) {
    videosGrid.innerHTML = videos.map(videoCardHTML).join("");

    if (videosFilters) {
      const cats = ["Todos", ...new Set(videos.map((v) => v.category))];
      videosFilters.innerHTML = cats
        .map(
          (cat, i) =>
            `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${escapeAttr(cat)}">${escapeAttr(cat)}</button>`
        )
        .join("");

      videosFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        videosFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        activeVideoCategory = btn.dataset.filter;
        applyVideoFilters();
      });
    }

    if (videosSearch) {
      videosSearch.addEventListener("input", applyVideoFilters);
    }
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
