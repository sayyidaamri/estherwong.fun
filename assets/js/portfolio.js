/* NOCTELLE — page 2 board + project detail modal */
(function () {
  "use strict";

  var DATA = window.NOCTELLE_DATA;
  var featuredRow = document.getElementById("ptFeaturedRow");
  var track = document.getElementById("ptSelectedTrack");
  var modal = document.querySelector("[data-pt-modal]");
  if (!DATA || !featuredRow || !track || !modal) return;

  var modalYear = modal.querySelector("[data-pt-modal-year]");
  var modalTitle = modal.querySelector("[data-pt-modal-title]");
  var modalSubtitle = modal.querySelector("[data-pt-modal-subtitle]");
  var modalIntro = modal.querySelector("[data-pt-modal-intro]");
  var modalVisual = modal.querySelector("[data-pt-modal-visual]");
  var modalTabs = modal.querySelector("[data-pt-section-tabs]");
  var modalDots = modal.querySelector("[data-pt-page-dots]");
  var navPrev = modal.querySelector("[data-pt-visual-prev]");
  var navNext = modal.querySelector("[data-pt-visual-next]");
  var navRail = modal.querySelector(".pt-visual-nav-rail");
  var closeControls = modal.querySelectorAll("[data-pt-close]");

  var ICONS = {
    star: '<path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    people: '<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16.5" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M15.5 13.6c2.6-.2 4.5 1.3 5 4.4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    target: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    check: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.3l2.7 2.7L16.2 9.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    box: '<rect x="4" y="5" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="9" width="5" height="4" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    doc: '<path d="M6 3.5h8l4 4v13H6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 11h6M9 14.5h6M9 18h4" stroke="currentColor" stroke-width="1.3"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || "pt-intro-icon") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.star) + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

  /* ─── board ─── */
  function nodeHTML(index, kind) {
    var p = DATA.projects[index];
    return (
      '<article class="pt-node pt-node--' + kind + (kind === "featured" ? "" : " is-active") + '">' +
      '<button class="pt-node-button" type="button" data-pt-project="' + index + '" aria-label="Buka detail proyek ' + esc(p.titleEn) + '">' +
      '<span class="pt-year">' + esc(p.year) + "</span>" +
      '<span class="pt-thumb-wrap"><img class="pt-thumb" src="' + p.thumb + '" alt="" loading="eager"></span>' +
      '<span class="pt-title">' + esc(p.title) + "<span>" + esc(p.titleEn) + "</span></span>" +
      '<span class="pt-desc">' + p.desc + "</span>" +
      '<img class="pt-rule" src="assets/svg/rule.svg" alt="" aria-hidden="true">' +
      "</button></article>"
    );
  }
  featuredRow.innerHTML = DATA.featured.map(function (i) { return nodeHTML(i, "featured"); }).join("");
  track.innerHTML = DATA.selected.map(function (i, n) {
    return (n ? '<img class="pt-connector" src="assets/svg/connector.svg" alt="" aria-hidden="true">' : "") + nodeHTML(i, "selected");
  }).join("");

  /* selected-row hover focus: the hovered node lights up, others dim */
  var selectedNodes = Array.prototype.slice.call(track.querySelectorAll(".pt-node"));
  selectedNodes.forEach(function (node) {
    node.addEventListener("mouseenter", function () {
      selectedNodes.forEach(function (n) { n.classList.toggle("is-active", n === node); });
    });
  });
  track.addEventListener("mouseleave", function () {
    selectedNodes.forEach(function (n) { n.classList.add("is-active"); });
  });

  /* ─── modal state ─── */
  var activeProject = null;
  var sectionIndex = 0;
  var pageIndex = 0;
  var lastTurn = 0;
  var lastFocus = null;
  var lockedY = 0;

  function sectionsOf(p) {
    return p.sections || [{ pages: p.pages }];
  }
  function pagesOf(p, s) { return sectionsOf(p)[s].pages; }
  function flatIndex() {
    var n = 0, secs = sectionsOf(activeProject);
    for (var i = 0; i < sectionIndex; i++) n += secs[i].pages.length;
    return n + pageIndex;
  }
  function totalPages() {
    return sectionsOf(activeProject).reduce(function (a, s) { return a + s.pages.length; }, 0);
  }

  function renderSectionTabs() {
    if (!activeProject.sections) {
      modalTabs.hidden = true; modalTabs.innerHTML = "";
      modal.classList.remove("has-sections");
      return;
    }
    modal.classList.add("has-sections");
    modalTabs.hidden = false;
    modalTabs.innerHTML = activeProject.sections.map(function (s, i) {
      return '<button type="button" class="pt-section-tab' + (i === sectionIndex ? " is-active" : "") + '" data-pt-section="' + i + '" aria-pressed="' + (i === sectionIndex) + '">' +
        icon(s.icon, "") + '<span class="pt-section-tab-copy"><span class="pt-section-tab-cn">' + esc(s.id) + '</span><span class="pt-section-tab-en">' + esc(s.en) + "</span></span></button>";
    }).join("");
  }

  function renderDots() {
    var pages = pagesOf(activeProject, sectionIndex);
    if (pages.length <= 1) { modalDots.hidden = true; modalDots.innerHTML = ""; return; }
    modalDots.hidden = false;
    modalDots.innerHTML = pages.map(function (_, i) {
      return '<button type="button" class="pt-page-dot" data-pt-page="' + i + '" aria-label="Halaman ' + (i + 1) + '" aria-current="' + (i === pageIndex) + '"></button>';
    }).join("");
  }

  function splitLines(t) {
    var parts = String(t).split("\n");
    return { a: parts[0] || "", b: parts.slice(1).join("\n") };
  }

  function renderTab(tab) {
    var head = '<div class="pt-intro-section-head">' + icon(tab.icon) + '<div class="pt-intro-section-title">' + esc(tab.id) + "<small>" + esc(tab.en) + "</small></div></div>";
    var body = "";
    if (tab.type === "summary") {
      body = '<div class="pt-summary-body">' + esc(tab.body) + "</div>";
    } else if (tab.type === "info") {
      body = tab.rows.map(function (r) {
        var val;
        if (String(r[2]).indexOf("chips:") === 0) {
          val = '<div class="pt-info-chips">' + r[2].slice(6).split(",").map(function (c) {
            var cp = c.split("|");
            return '<span class="pt-info-chip"><span class="pt-chip-cn">' + esc(cp[0]) + '</span><span class="pt-chip-en">' + esc(cp[1] || "") + "</span></span>";
          }).join("") + "</div>";
        } else {
          val = '<div class="pt-info-cn">' + esc(r[2]) + '</div><div class="pt-info-en">' + esc(r[3]) + "</div>";
        }
        return '<div class="pt-info-row"><div class="pt-info-label"><span>' + esc(r[0]) + "</span><small>" + esc(r[1]) + "</small></div><div>" + val + "</div></div>";
      }).join("");
    } else if (tab.type === "modules") {
      body = '<div class="pt-module-list">' + tab.modules.map(function (m) {
        return '<div class="pt-mini-module"><div class="pt-mini-module-head">' + esc(m[0]) + '</div><div class="pt-mini-module-body">' + esc(m[1]) + "</div></div>";
      }).join("") + "</div>";
    } else {
      body = '<div class="pt-text-body' + (tab.key === "key" ? " is-key" : "") + '">' + esc(tab.body) + "</div>";
    }
    return '<div class="pt-intro-tab-panel" role="tabpanel">' + head + body + "</div>";
  }

  var activeTabKey = "summary";
  function renderIntro(page) {
    var tabs = page.tabs || [];
    if (!tabs.some(function (t) { return t.key === activeTabKey; })) activeTabKey = tabs[0] ? tabs[0].key : "";
    var list = '<div class="pt-intro-tablist" role="tablist">' + tabs.map(function (t) {
      var on = t.key === activeTabKey;
      return '<button type="button" role="tab" class="pt-intro-tab' + (on ? " is-active" : "") + '" aria-selected="' + on + '" data-pt-tab="' + t.key + '">' + icon(t.icon) +
        '<span class="pt-intro-tab-text"><span class="pt-intro-tab-cn">' + esc(t.id) + '</span><span class="pt-intro-tab-en">' + esc(t.en) + "</span></span></button>";
    }).join("") + "</div>";
    var current = tabs.filter(function (t) { return t.key === activeTabKey; })[0];
    modalIntro.innerHTML = '<div class="pt-intro-tabs">' + list + (current ? renderTab(current) : "") + "</div>";
    modalIntro.scrollTop = 0;
  }

  function renderVisual(src) {
    modalVisual.innerHTML = "";
    modalVisual.classList.add("is-loading");
    var img = new Image();
    img.className = "pt-modal-visual-img";
    img.alt = "";
    img.onload = function () { modalVisual.classList.remove("is-loading"); };
    img.onerror = function () { modalVisual.classList.remove("is-loading"); };
    img.src = src;
    modalVisual.appendChild(img);
    if (img.complete) modalVisual.classList.remove("is-loading");
  }

  function setPage(i) {
    var pages = pagesOf(activeProject, sectionIndex);
    pageIndex = clamp(i, 0, pages.length - 1);
    var page = pages[pageIndex];
    modalYear.textContent = page.header || activeProject.year;
    modalTitle.innerHTML = '<span class="pt-title-cn">' + esc(page.title) + '</span><span class="pt-title-en">' + esc(page.titleEn || "") + "</span>";
    modalSubtitle.textContent = page.subtitle || "";
    modalSubtitle.hidden = !page.subtitle;
    renderIntro(page);
    renderVisual(page.visual);
    Array.prototype.forEach.call(modalDots.querySelectorAll(".pt-page-dot"), function (d, n) {
      d.setAttribute("aria-current", n === pageIndex ? "true" : "false");
    });
    updateNav();
  }

  function setSection(s, p) {
    sectionIndex = clamp(s, 0, sectionsOf(activeProject).length - 1);
    pageIndex = p || 0;
    renderSectionTabs();
    renderDots();
    setPage(pageIndex);
  }

  function updateNav() {
    var show = totalPages() > 1;
    var flat = flatIndex();
    navPrev.hidden = !show || flat === 0;
    navNext.hidden = !show || flat === totalPages() - 1;
    navRail.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function turn(dir) {
    if (!activeProject || totalPages() <= 1) return;
    var now = Date.now();
    if (now - lastTurn < 420) return;
    lastTurn = now;
    var pages = pagesOf(activeProject, sectionIndex);
    if (dir > 0) {
      if (pageIndex < pages.length - 1) setPage(pageIndex + 1);
      else if (sectionIndex < sectionsOf(activeProject).length - 1) setSection(sectionIndex + 1, 0);
    } else {
      if (pageIndex > 0) setPage(pageIndex - 1);
      else if (sectionIndex > 0) setSection(sectionIndex - 1, pagesOf(activeProject, sectionIndex - 1).length - 1);
    }
  }

  function openModal(index) {
    var p = DATA.projects[index];
    if (!p) return;
    lastFocus = document.activeElement;
    lockedY = window.scrollY;
    activeProject = p;
    activeTabKey = "summary";
    modal.classList.add("is-open", "is-paged");
    modal.setAttribute("aria-hidden", "false");
    setSection(0, 0);
    document.body.classList.add("pt-modal-lock");
    window.dispatchEvent(new CustomEvent("pt:portfolio-modal-toggle", { detail: { isOpen: true, lockedScrollY: lockedY } }));
    modal.querySelector(".pt-close").focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open", "is-paged", "has-sections");
    modal.setAttribute("aria-hidden", "true");
    modalVisual.innerHTML = "";
    modalTabs.hidden = true; modalTabs.innerHTML = "";
    modalDots.hidden = true; modalDots.innerHTML = "";
    navPrev.hidden = navNext.hidden = true;
    activeProject = null;
    document.body.classList.remove("pt-modal-lock");
    window.dispatchEvent(new CustomEvent("pt:portfolio-modal-toggle", { detail: { isOpen: false, lockedScrollY: lockedY } }));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ─── events ─── */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-pt-project]");
    if (btn) { e.preventDefault(); openModal(Number(btn.getAttribute("data-pt-project"))); }
  });
  Array.prototype.forEach.call(closeControls, function (c) { c.addEventListener("click", closeModal); });
  modalTabs.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pt-section]");
    if (b) setSection(Number(b.getAttribute("data-pt-section")), 0);
  });
  modalDots.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pt-page]");
    if (b) setPage(Number(b.getAttribute("data-pt-page")));
  });
  modalIntro.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pt-tab]");
    if (!b || !activeProject) return;
    activeTabKey = b.getAttribute("data-pt-tab");
    renderIntro(pagesOf(activeProject, sectionIndex)[pageIndex]);
    var t = modalIntro.querySelector('[data-pt-tab="' + activeTabKey + '"]');
    if (t) t.focus({ preventScroll: true });
  });
  navPrev.addEventListener("click", function () { lastTurn = 0; turn(-1); });
  navNext.addEventListener("click", function () { lastTurn = 0; turn(1); });

  var scrollTimer = 0;
  modal.addEventListener("wheel", function (e) {
    if (!activeProject) return;
    if (Math.abs(e.deltaX) > 18 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault(); turn(e.deltaX > 0 ? 1 : -1); return;
    }
    if (!e.target.closest(".pt-modal-intro")) {
      var el = modalIntro;
      if (el.scrollHeight > el.clientHeight + 1 && window.innerWidth > 720) { el.scrollTop += e.deltaY; e.preventDefault(); }
    }
    modalIntro.classList.add("is-scroll-active");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () { modalIntro.classList.remove("is-scroll-active"); }, 900);
  }, { passive: false });

  var sx = 0, sy = 0, tracking = false;
  modal.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = !!e.target.closest(".pt-modal-visual-stage");
  }, { passive: true });
  modal.addEventListener("touchend", function (e) {
    if (!tracking) return; tracking = false;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy)) { lastTurn = 0; turn(dx < 0 ? 1 : -1); }
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); }
    else if (e.key === "ArrowRight") { lastTurn = 0; turn(1); }
    else if (e.key === "ArrowLeft") { lastTurn = 0; turn(-1); }
  });

  window.NoctellePortfolio = { open: openModal, close: closeModal, isOpen: function () { return modal.classList.contains("is-open"); } };
})();
