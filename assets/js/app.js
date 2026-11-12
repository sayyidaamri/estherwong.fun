/* NOCTELLE — cinematic five-page experience
   page 1: scroll-scrubbed frame sequence · page 2: video → UX board · page 3: video → still
   page 4: orb scene (scratch reveal + flip) · page 5: eyes that follow the cursor */
(function () {
  "use strict";

  var MOBILE_QUERY = window.matchMedia("(max-width: 720px), (pointer: coarse)");
  var IS_MOBILE = MOBILE_QUERY.matches;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CONFIG = {
    fps: 30,
    totalFrames: 150,
    framePath: function (i) { return "assets/frames/frame_" + String(i).padStart(4, "0") + ".webp"; },
    readyFrames: IS_MOBILE ? 16 : 30,
    textFadeInStart: 0.68,
    textFadeInEnd: 1,
    textFadeOutRatio: 0.14,
    textSlide: 42,
    textSmooth: 0.12
  };
  var P1 = 0, P2 = 1, P3 = 2, P4 = 3, P5 = 4, PAGE_COUNT = 5;
  var SEGMENTS = {}; SEGMENTS[P2] = { start: 0, end: 5 }; SEGMENTS[P3] = { start: 5, end: 10.1 };
  var SCRUB_END = 80, SCRUB_RATE = 0.12, SCRUB_COOLDOWN = 520;
  var SECTION_SCROLL_MS = 620, WHEEL_MIN = 24, POST_SCROLL_MS = 420, TURN_MS = 2200;
  var PAGE1_BG = "assets/img/page1-bg.webp", PAGE3_BG = "assets/img/page3-bg.webp";
  var P4_IMG = { w: 2000, h: 1314, orbX: 0.502, orbY: 0.365, orbR: 0.172 };
  var P5_IMG = { w: 1920, h: 1080 };
  var EYE_MAX_X = 11, EYE_MAX_Y = 1.5;

  var $ = function (id) { return document.getElementById(id); };
  var canvas = $("bgCanvas"), ctx = canvas.getContext("2d");
  var video = $("page23Video");
  var sections = [1, 2, 3, 4, 5].map(function (i) { return $("page-" + i); });
  var contents = [1, 2, 3, 4, 5].map(function (i) { return $("page" + i + "Content"); });
  var loader = $("loader"), loaderBar = $("loaderProgress"), loaderPct = $("loaderPercent"), loaderText = $("loaderText"), enterBtn = $("loaderEnterBtn");
  var navLinks = $("navLinks"), dropdown = $("projectsDropdown"), dropdownBtn = $("projectsMenuBtn"), soundToggle = $("soundToggle"), audio = $("bgAudio");
  var hint = $("scrollHint");
  var turnStage = $("pageTurnStage"), turnImage = $("pageTurnStageImage"), turnCurl = $("pageTurnCurl");
  var p4Scene = document.querySelector(".page4-scene");
  var p4Front = document.querySelector(".page4-layer--front"), p4Back = document.querySelector(".page4-layer--back");
  var p4Preview = $("page4PreviewLayer"), p4PreviewCtx = p4Preview.getContext("2d");
  var p4Mask = document.createElement("canvas"), p4MaskCtx = p4Mask.getContext("2d");
  var p5Scene = document.querySelector(".page5-scene");
  var eyeL = $("page5RightEyeWindow"), eyeR = $("page5SecondEyeWindow");
  var otherModal = $("otherProjectsModal"), otherGallery = $("otherProjectsGallery");
  var introModal = $("introModal"), introLangBtn = $("introLangBtn");

  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(a, b, x) { var t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  /* ═══ state ═══ */
  var frames = new Array(CONFIG.totalFrames + 1);
  var page1Bg = null, page3Bg = null;
  var entered = false, ready = false;
  var playback = [
    { frame: 1, done: false }, { progress: 0, done: false }, { progress: 0, done: false }, { done: true }, { done: true }
  ];
  var scrubFrame = 1, scrubDone = false, scrubLockUntil = 0;
  var lastPage = 0, displayed = -1, showing = "";
  var scrollDir = 1, lastScrollY = 0;
  var sectionScrolling = false, scrollLocked = false, wheelLocked = false, targetPage = null, tweenRaf = null, cooldownTimer = 0;
  var contentState = contents.map(function () { return { o: 0, y: 0 }; });
  var portfolioOpen = false, otherOpen = false, introOpen = false;
  var soundOn = true, audioBlocked = false;
  var savedScrollY = 0;

  function suspended() { return portfolioOpen || otherOpen || introOpen; }
  function activeIndexFromScroll() {
    var mid = window.scrollY + window.innerHeight * 0.5;
    return clamp(Math.floor(mid / window.innerHeight), 0, PAGE_COUNT - 1);
  }
  function activePage() { return sectionScrolling && targetPage !== null ? targetPage : activeIndexFromScroll(); }

  /* ═══ loading ═══ */
  function loadImage(src) {
    return new Promise(function (res) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { res(img); };
      img.onerror = function () { res(null); };
      img.src = src;
    });
  }
  function ensureFrame(i) {
    if (frames[i] && frames[i] !== true) return Promise.resolve(frames[i]);
    if (frames[i] === true) return Promise.resolve(null);
    frames[i] = true;
    return loadImage(CONFIG.framePath(i)).then(function (img) { frames[i] = img; if (Math.round(currentFrame()) === i) displayed = -1; return img; });
  }

  var shownPct = 0, realPct = 0, loadStart = performance.now();
  function loaderLoop() {
    var minByTime = clamp((performance.now() - loadStart) / 1400, 0, 1) * 100;
    shownPct = Math.min(realPct, Math.max(shownPct + 0.6, Math.min(minByTime, realPct)));
    if (realPct >= 100 && shownPct > 99) shownPct = 100;
    loaderPct.textContent = Math.round(shownPct) + "%";
    loaderBar.style.width = shownPct + "%";
    if (shownPct >= 100) {
      ready = true;
      loader.classList.add("is-ready");
      loaderText.textContent = "Ready";
      renderFrame(1);
      return;
    }
    requestAnimationFrame(loaderLoop);
  }
  function preload() {
    var jobs = [];
    for (var i = 1; i <= CONFIG.readyFrames; i++) jobs.push(ensureFrame(i));
    jobs.push(loadImage(PAGE1_BG).then(function (i) { page1Bg = i; }));
    var done = 0;
    jobs.forEach(function (p) { p.then(function () { done++; realPct = (done / jobs.length) * 100; }); });
    requestAnimationFrame(loaderLoop);
    Promise.all(jobs).then(function () {
      loadImage(PAGE3_BG).then(function (i) { page3Bg = i; });
      var n = CONFIG.readyFrames + 1;
      (function next() { if (n > CONFIG.totalFrames) return; ensureFrame(n++).then(next); })();
    });
  }

  /* ═══ canvas ═══ */
  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    displayed = -1; showing = "";
  }
  function coverRect(iw, ih, vw, vh, fx) {
    var s = Math.max(vw / iw, vh / ih), w = iw * s, h = ih * s;
    return { left: (vw - w) * (fx == null ? 0.5 : fx), top: (vh - h) / 2, width: w, height: h };
  }
  function drawCover(c, img, w, h, fx) {
    if (!img) return;
    var r = coverRect(img.naturalWidth || img.width, img.naturalHeight || img.height, w, h, fx);
    c.drawImage(img, r.left, r.top, r.width, r.height);
  }
  function nearestFrame(i) {
    for (var d = 0; d < 40; d++) {
      if (frames[i - d] && frames[i - d] !== true) return frames[i - d];
      if (frames[i + d] && frames[i + d] !== true) return frames[i + d];
    }
    return null;
  }
  function renderFrame(f) {
    var i = clamp(Math.round(f), 1, CONFIG.totalFrames);
    var img = frames[i] && frames[i] !== true ? frames[i] : nearestFrame(i);
    if (!frames[i]) ensureFrame(i);
    if (!img) return;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCover(ctx, img, canvas.width, canvas.height);
    displayed = img === frames[i] ? i : -1;
    showing = "frames";
  }
  function renderStill(img, tag) {
    if (!img) return;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCover(ctx, img, canvas.width, canvas.height);
    showing = tag;
  }

  /* ═══ video segments ═══ */
  var seekReq = 0;
  function setVideo(page, time, play) {
    var seg = SEGMENTS[page]; if (!seg) return;
    var req = ++seekReq;
    var apply = function () {
      if (req !== seekReq) return;
      video.pause();
      var t = clamp(time, seg.start, seg.end);
      var begin = function () { if (req === seekReq && play) video.play().catch(function () {}); };
      if (Math.abs(video.currentTime - t) > 0.01) { video.addEventListener("seeked", begin, { once: true }); video.currentTime = t; }
      else begin();
    };
    if (video.readyState >= 1) apply();
    else { video.addEventListener("loadedmetadata", apply, { once: true }); video.load(); }
  }

  function currentFrame() { return playback[P1].frame; }

  /* ═══ page playback (per tick) ═══ */
  function onEnterPage(i) {
    if (lastPage === P4 && i !== P4) resetPage4();
    if (lastPage === P5 && i !== P5) resetEyes();
    if (i === P5) layoutEyes();
    if (SEGMENTS[i]) {
      playback[i].done = false; playback[i].progress = 0;
      setVideo(i, SEGMENTS[i].start, true);
    }
    lastPage = i;
  }

  function updatePlayback(dt) {
    if (!entered) return;
    if (suspended()) { video.pause(); return; }
    var i = activePage();
    if (i !== lastPage) onEnterPage(i);

    if (i === P1) {
      var pb = playback[P1];
      if (scrubDone && !pb.done) {
        pb.frame = Math.min(CONFIG.totalFrames, pb.frame + CONFIG.fps * dt);
        if (pb.frame >= CONFIG.totalFrames) pb.done = true;
      }
    } else if (SEGMENTS[i]) {
      var seg = SEGMENTS[i], p = playback[i];
      if (!p.done) {
        var t = clamp(video.currentTime, seg.start, seg.end);
        p.progress = clamp((t - seg.start) / (seg.end - seg.start), 0, 1);
        if (t >= seg.end - 1 / CONFIG.fps || video.ended) { video.pause(); p.progress = 1; p.done = true; }
      }
    }
  }

  function pageProgress(i) {
    if (i === P1) return playback[P1].done ? 1 : (playback[P1].frame - 1) / (CONFIG.totalFrames - 1);
    if (SEGMENTS[i]) return playback[i].done ? 1 : playback[i].progress;
    return 1;
  }

  function updateBackground() {
    var i = activePage();
    var p3Still = i === P3 && playback[P3].done;
    var showCanvas = i === P1 || p3Still;
    var showVideo = !!SEGMENTS[i] && !p3Still;
    canvas.classList.toggle("is-page1-breathe", i === P1 && !REDUCED);
    canvas.classList.toggle("is-page3-zoom", p3Still && !REDUCED);
    canvas.style.opacity = showCanvas ? "1" : "0";
    video.classList.toggle("is-active", showVideo);
    if (!showVideo && !video.paused && !SEGMENTS[i]) video.pause();

    if (i === P1) {
      if (playback[P1].done && page1Bg) { if (showing !== "p1bg") renderStill(page1Bg, "p1bg"); }
      else if (Math.round(currentFrame()) !== displayed || showing !== "frames") renderFrame(currentFrame());
    } else if (p3Still && page3Bg && showing !== "p3bg") {
      renderStill(page3Bg, "p3bg");
    }
  }

  function applyContent(el, st, o, y) {
    st.o = lerp(st.o, o, CONFIG.textSmooth); st.y = lerp(st.y, y, CONFIG.textSmooth);
    if (Math.abs(st.o - o) < 0.002) st.o = o;
    el.style.opacity = st.o.toFixed(3);
    var left = el.classList.contains("page__content--left");
    if (el.id === "page2Content") el.style.transform = "translateY(" + st.y.toFixed(2) + "px)";
    else el.style.transform = left ? "translateY(calc(-50% + " + st.y.toFixed(2) + "px))" : "translate(-50%, calc(-50% + " + st.y.toFixed(2) + "px))";
    el.style.pointerEvents = st.o > 0.4 ? "auto" : "none";
  }
  function snapContent(index) {
    contents.forEach(function (el, i) {
      var show = i === index && (index !== P2 || playback[P2].done) && (index !== P1 || playback[P1].done);
      contentState[i].o = show ? 1 : 0;
      contentState[i].y = i === index ? 0 : (i < index ? -CONFIG.textSlide * 0.5 : CONFIG.textSlide);
      applyContent(el, contentState[i], contentState[i].o, contentState[i].y);
    });
  }

  var lastActiveNode = -1;
  function updateContentUI() {
    var i = activePage();
    var prog = sectionScrolling && targetPage !== null && i !== P2 ? 1 : pageProgress(i);
    if (i === P2) prog = playback[P2].done ? 1 : 0;
    if (i === P1 && !playback[P1].done) prog = pageProgress(P1);

    if (i !== lastActiveNode) {
      lastActiveNode = i;
      sections.forEach(function (s, n) { s.classList.toggle("is-render-active", n === i); });
      navLinks.querySelectorAll("a[data-node]").forEach(function (a) { a.classList.toggle("is-active", Number(a.dataset.node) === i); });
    }
    contents.forEach(function (el, n) {
      var o = 0, y = scrollDir > 0 ? CONFIG.textSlide : -CONFIG.textSlide;
      if (n === i) {
        var fin = smoothstep(CONFIG.textFadeInStart, CONFIG.textFadeInEnd, prog);
        o = fin;
        var base = (1 - fin) * CONFIG.textSlide;
        y = scrollDir > 0 ? base : -base;
      } else if (n === i - 1 && i !== P2) {
        o = (1 - smoothstep(0, CONFIG.textFadeOutRatio, prog)) * 0.35;
        y = scrollDir > 0 ? -CONFIG.textSlide * 0.5 : CONFIG.textSlide * 0.5;
      }
      applyContent(el, contentState[n], o, y);
    });

    if (suspended() || !entered) { hint.style.opacity = "0"; return; }
    if (i === P1) {
      var d = playback[P1].done;
      hint.textContent = d ? "Scroll down" : "Scroll to explore";
      hint.style.opacity = String(d ? 0.6 : Math.max(0, 0.48 - pageProgress(P1) * 0.48));
    } else if (i === P4) {
      hint.style.opacity = "0";
    } else if (i === P5) {
      hint.textContent = "Last page"; hint.style.opacity = "0.6";
    } else {
      hint.textContent = "Scroll down";
      hint.style.opacity = String(Math.max(0, 0.6 - prog * 0.5));
    }
  }

  /* ═══ main loop ═══ */
  var lastTick = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    var dt = lastTick ? Math.min(now - lastTick, 100) / 1000 : 1 / 60;
    lastTick = now;
    updatePlayback(dt);
    updateBackground();
    updateContentUI();
  }

  /* ═══ section scrolling ═══ */
  function clearWheelLock() { if (cooldownTimer) { clearTimeout(cooldownTimer); cooldownTimer = 0; } wheelLocked = false; }
  function postCooldown() {
    clearWheelLock(); wheelLocked = true;
    cooldownTimer = setTimeout(function () { sectionScrolling = false; scrollLocked = false; targetPage = null; wheelLocked = false; cooldownTimer = 0; }, POST_SCROLL_MS);
  }
  function startSectionScroll(target) {
    var index = clamp(target, 0, PAGE_COUNT - 1);
    var from = activePage();
    var startY = window.scrollY, targetY = Math.round(index * window.innerHeight);
    if (scrollLocked || sectionScrolling) return false;
    if (Math.abs(targetY - startY) < 2) { window.scrollTo(0, targetY); snapContent(index); return false; }
    if (tweenRaf) cancelAnimationFrame(tweenRaf);
    clearWheelLock();
    scrollLocked = sectionScrolling = wheelLocked = true;
    targetPage = index;
    scrollDir = index > from ? 1 : -1;
    if (from === P4 && index === P5) playTurn(); else resetTurn();
    var t0 = performance.now();
    var dur = REDUCED ? 1 : SECTION_SCROLL_MS;
    (function step(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      window.scrollTo(0, lerp(startY, targetY, easeInOutCubic(p)));
      if (p < 1) { tweenRaf = requestAnimationFrame(step); return; }
      window.scrollTo(0, targetY); tweenRaf = null; lastScrollY = targetY;
      snapContent(index); postCooldown();
    })(t0);
    return true;
  }
  function scrollableAncestor(target, dy) {
    var el = target instanceof Element ? target : null;
    while (el && el !== document.body) {
      var oy = getComputedStyle(el).overflowY;
      if (/(auto|scroll)/.test(oy) && el.scrollHeight > el.clientHeight + 1) {
        if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return el;
      }
      el = el.parentElement;
    }
    return null;
  }
  function bypass(e) {
    if (suspended()) return true;
    if (e.target instanceof Element && e.target.closest("#introModal, #otherProjectsModal, [data-pt-modal]")) return true;
    return !!scrollableAncestor(e.target, e.deltaY);
  }
  function handleScrub(dy) {
    if (!entered || activePage() !== P1 || playback[P1].done) return false;
    if (scrubDone && dy > 0) return false;
    if (scrubDone && dy < 0) { scrubDone = false; scrubFrame = Math.min(playback[P1].frame, SCRUB_END); }
    var was = scrubDone;
    scrubFrame = clamp(scrubFrame + dy * SCRUB_RATE, 1, SCRUB_END);
    if (scrubFrame >= SCRUB_END - 0.01) { scrubDone = true; if (!was && dy > 0) scrubLockUntil = performance.now() + SCRUB_COOLDOWN; }
    playback[P1].frame = scrubFrame;
    return true;
  }
  function handleWheel(e) {
    if (e.ctrlKey || e.metaKey) return;
    if (bypass(e)) return;
    e.preventDefault();
    if (!entered || sectionScrolling || wheelLocked || scrollLocked) return;
    var dx = e.deltaX, dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 32;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 1 && handleScrub(dy)) return;
    if (dy > 0 && activePage() === P1 && performance.now() < scrubLockUntil) return;
    if (Math.abs(dy) <= Math.abs(dx) || Math.abs(dy) < WHEEL_MIN) return;
    goRelative(dy > 0 ? 1 : -1);
  }
  function goRelative(dir) {
    var cur = activeIndexFromScroll();
    var target = clamp(cur + dir, 0, PAGE_COUNT - 1);
    if (target === cur) return;
    if (cur === P1 && dir > 0) { playback[P1].frame = CONFIG.totalFrames; playback[P1].done = true; scrubDone = true; }
    startSectionScroll(target);
  }

  /* touch */
  var tStartX = 0, tStartY = 0, tStartAt = 0, tStartIndex = 0;
  function ignoreSwipe(t) { return t instanceof Element && !!t.closest("#introModal, #otherProjectsModal, [data-pt-modal], button, a, input, textarea, select, .pt-viewport--selected"); }
  document.addEventListener("touchstart", function (e) {
    if (!entered || e.touches.length !== 1 || ignoreSwipe(e.target)) return;
    tStartX = e.touches[0].clientX; tStartY = e.touches[0].clientY; tStartAt = performance.now(); tStartIndex = activeIndexFromScroll();
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (!tStartAt || e.changedTouches.length !== 1) return;
    var dx = e.changedTouches[0].clientX - tStartX, dy = e.changedTouches[0].clientY - tStartY, el = performance.now() - tStartAt;
    tStartAt = 0;
    if (el > 850 || Math.abs(dy) < 52 || Math.abs(dy) <= Math.abs(dx) * 1.15) return;
    if (sectionScrolling || scrollLocked || suspended()) return;
    /* let the board scroll itself on small screens */
    var board = e.target instanceof Element && e.target.closest(".pt-sticky");
    if (board && scrollableAncestor(board, -dy)) return;
    var dir = dy < 0 ? 1 : -1;
    if (tStartIndex === P1 && dir > 0 && !playback[P1].done && !scrubDone) { scrubDone = true; return; }
    goRelative(dir);
  }, { passive: true });
  /* block native touch scroll between pages */
  document.addEventListener("touchmove", function (e) {
    if (!entered || suspended()) return;
    if (e.target instanceof Element && (e.target.closest(".pt-sticky, .pt-viewport--selected, #introModal, [data-pt-modal], #otherProjectsModal"))) return;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  document.addEventListener("keydown", function (e) {
    if (!entered || suspended()) return;
    if (e.target instanceof Element && e.target.closest("input, textarea")) return;
    var k = e.key;
    if (k === "ArrowDown" || k === "PageDown" || (k === " " && !(e.target instanceof HTMLButtonElement))) {
      e.preventDefault();
      if (activePage() === P1 && !scrubDone) { scrubDone = true; scrubLockUntil = 0; return; }
      if (!sectionScrolling) goRelative(1);
    } else if (k === "ArrowUp" || k === "PageUp") {
      e.preventDefault(); if (!sectionScrolling) goRelative(-1);
    } else if (k === "Home") { e.preventDefault(); startSectionScroll(0); }
    else if (k === "End") { e.preventDefault(); startSectionScroll(PAGE_COUNT - 1); }
  });

  window.addEventListener("scroll", function () {
    if (suspended()) return;
    var y = window.scrollY;
    scrollDir = y > lastScrollY ? 1 : y < lastScrollY ? -1 : scrollDir;
    lastScrollY = y;
  }, { passive: true });

  /* ═══ page turn 4 → 5 ═══ */
  var turnAnims = [];
  function resetTurn() {
    turnAnims.forEach(function (a) { a.cancel(); }); turnAnims = [];
    turnStage.classList.remove("is-dissolving");
    turnStage.style.opacity = "0"; turnStage.style.visibility = "hidden";
    p5Scene.style.opacity = ""; p5Scene.style.filter = "";
  }
  function playTurn() {
    resetTurn();
    if (IS_MOBILE || REDUCED || !turnStage.animate) return;
    var ease = "cubic-bezier(0.32, 0, 0.12, 1)";
    turnStage.style.visibility = "visible";
    turnStage.classList.add("is-dissolving");
    turnAnims.push(turnStage.animate([
      { opacity: 0, transform: "scale(1.075)", filter: "blur(12px) brightness(0.72)" },
      { opacity: 0.72, transform: "scale(1.038)", filter: "blur(5px) brightness(0.9)", offset: 0.48 },
      { opacity: 1, transform: "scale(1)", filter: "blur(0px) brightness(1)" }
    ], { duration: TURN_MS, easing: ease, fill: "forwards" }));
    turnAnims.push(turnImage.animate([
      { transform: "scale(1.04)", filter: "brightness(0.84) saturate(1.06)" },
      { transform: "scale(1)", filter: "brightness(1) saturate(1)" }
    ], { duration: TURN_MS, easing: ease, fill: "forwards" }));
    turnAnims.push(p5Scene.animate([
      { opacity: 0, filter: "blur(8px) brightness(0.88)" },
      { opacity: 0, filter: "blur(8px) brightness(0.88)", offset: 0.86 },
      { opacity: 1, filter: "blur(0px) brightness(1)" }
    ], { duration: TURN_MS, easing: ease, fill: "forwards" }));
    turnAnims.push(p4Scene.animate([
      { opacity: 1, transform: "scale(1)", filter: "blur(0px) brightness(1)" },
      { opacity: 0.32, transform: "scale(1.055)", filter: "blur(10px) brightness(0.72)" }
    ], { duration: TURN_MS * 0.78, easing: ease }));
    turnAnims.push(turnCurl.animate([
      { opacity: 0, transform: "translateX(0) skewX(-8deg)" },
      { opacity: 0.9, transform: "translateX(-60vw) skewX(-8deg)", offset: 0.5 },
      { opacity: 0, transform: "translateX(-140vw) skewX(-8deg)" }
    ], { duration: TURN_MS * 0.8, easing: ease }));
    turnAnims[0].onfinish = function () { resetTurn(); };
  }

  /* ═══ page 4 — orb, scratch reveal, flip ═══ */
  var p4Flipped = false, p4Points = [], p4Raf = null, p4Last = 0, p4LastPt = null, p4InOrb = false, orb = { x: 0, y: 0, r: 0 };
  function layoutPage4() {
    var w = window.innerWidth, h = window.innerHeight;
    var r = coverRect(P4_IMG.w, P4_IMG.h, w, h);
    orb.x = r.left + r.width * P4_IMG.orbX; orb.y = r.top + r.height * P4_IMG.orbY; orb.r = r.width * P4_IMG.orbR;
    p4Scene.style.setProperty("--orb-x", (orb.x / w * 100).toFixed(2) + "%");
    p4Scene.style.setProperty("--orb-y", (orb.y / h * 100).toFixed(2) + "%");
    p4Scene.style.setProperty("--orb-d", (orb.r * 2).toFixed(1) + "px");
    p4Preview.width = p4Mask.width = w; p4Preview.height = p4Mask.height = h;
  }
  function stamp(x, y, o) {
    o = o || {};
    var life = o.life || 1120;
    p4Points.push({ x: x, y: y, life: life, max: life, a: o.alpha == null ? 1 : o.alpha, r: 33 * (0.92 + (o.strength == null ? 0.9 : o.strength) * 0.12) * (o.scale || 1) });
  }
  function startReveal() { if (p4Raf === null) p4Raf = requestAnimationFrame(revealStep); }
  function revealStep(now) {
    var dt = p4Last ? (now - p4Last) : 16; p4Last = now;
    p4Points = p4Points.filter(function (p) { p.life -= dt; return p.life > 0; });
    renderReveal();
    if (p4Points.length) { p4Raf = requestAnimationFrame(revealStep); return; }
    p4Raf = null; p4Last = 0;
  }
  function renderReveal() {
    var w = p4Preview.width, h = p4Preview.height;
    p4PreviewCtx.clearRect(0, 0, w, h);
    if (!p4Points.length) { p4Preview.style.opacity = "0"; return; }
    p4MaskCtx.clearRect(0, 0, w, h);
    var maxA = 0;
    p4Points.forEach(function (p) {
      var lr = clamp(p.life / p.max, 0, 1), a = easeOutCubic(lr) * 0.98 * p.a, rad = p.r * (1.02 + (1 - lr) * 0.18);
      var g = p4MaskCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      g.addColorStop(0, "rgba(255,255,255," + a + ")"); g.addColorStop(0.42, "rgba(255,255,255," + a * 0.96 + ")");
      g.addColorStop(0.72, "rgba(255,255,255," + a * 0.5 + ")"); g.addColorStop(0.9, "rgba(255,255,255," + a * 0.12 + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
      p4MaskCtx.fillStyle = g; p4MaskCtx.fillRect(p.x - rad, p.y - rad, rad * 2, rad * 2);
      maxA = Math.max(maxA, a);
    });
    drawCover(p4PreviewCtx, p4Flipped ? p4Front : p4Back, w, h);
    p4PreviewCtx.globalCompositeOperation = "destination-in";
    p4PreviewCtx.drawImage(p4Mask, 0, 0);
    p4PreviewCtx.globalCompositeOperation = "source-over";
    p4Preview.style.opacity = String(clamp(maxA * 1.04, 0, 1));
  }
  function clearReveal() {
    if (p4Raf !== null) cancelAnimationFrame(p4Raf);
    p4Raf = null; p4Last = 0; p4Points = [];
    p4PreviewCtx.clearRect(0, 0, p4Preview.width, p4Preview.height); p4Preview.style.opacity = "0";
  }
  function setFlip(v) { if (p4Flipped === v) return; p4Flipped = v; clearReveal(); p4Scene.classList.toggle("is-page4-flipped", v); }
  function resetPage4() { p4Flipped = false; p4Scene.classList.remove("is-page4-flipped"); clearReveal(); p4LastPt = null; p4InOrb = false; }
  function inOrb(pt) { return Math.hypot(pt.x - orb.x, pt.y - orb.y) <= orb.r * 1.04; }
  if (!IS_MOBILE) {
    p4Scene.addEventListener("mouseenter", function (e) {
      var pt = { x: e.clientX, y: e.clientY }; p4LastPt = pt; p4InOrb = inOrb(pt);
      stamp(pt.x, pt.y, { strength: 0.42, life: 860, alpha: 0.18, scale: 1.16 }); startReveal();
    });
    p4Scene.addEventListener("mousemove", function (e) {
      var pt = { x: e.clientX, y: e.clientY };
      if (!p4LastPt) { p4LastPt = pt; p4InOrb = inOrb(pt); return; }
      var d = Math.hypot(pt.x - p4LastPt.x, pt.y - p4LastPt.y), now = inOrb(pt);
      if (d >= 4) {
        var steps = Math.max(1, Math.ceil(d / 28));
        for (var s = 0; s <= steps; s++) stamp(lerp(p4LastPt.x, pt.x, s / steps), lerp(p4LastPt.y, pt.y, s / steps));
        startReveal(); p4LastPt = pt;
      }
      if (now && !p4InOrb) setFlip(!p4Flipped);
      p4InOrb = now;
    });
    p4Scene.addEventListener("mouseleave", function () { p4LastPt = null; p4InOrb = false; });
  } else {
    p4Scene.addEventListener("click", function () { setFlip(!p4Flipped); });
  }

  /* ═══ page 5 — eyes ═══ */
  /* positions are % of the 1920×1080 eye image (measured) */
  var EYES = [
    { el: eyeL, x: 18.2, y: 50, size: 15.6, cx: 19.4, cy: 50.4, rx: 11.4, ry: 6.4 },
    { el: eyeR, x: 80.7, y: 42.6, size: 15.6, cx: 81.2, cy: 42.4, rx: 10.6, ry: 7.6 }
  ];
  var turnEyes = EYES.map(function (e) { var c = e.el.cloneNode(true); c.removeAttribute("id"); c.removeAttribute("tabindex"); c.removeAttribute("role"); c.setAttribute("aria-hidden", "true"); turnStage.appendChild(c); return c; });
  function layoutEyes() {
    var r = coverRect(P5_IMG.w, P5_IMG.h, window.innerWidth, window.innerHeight, window.innerWidth <= 720 ? 0.93 : 0.5);
    EYES.forEach(function (e, n) {
      [e.el, turnEyes[n]].forEach(function (w) {
        w.style.left = r.left + "px"; w.style.top = r.top + "px"; w.style.width = r.width + "px"; w.style.height = r.height + "px";
        w.style.setProperty("--eye-x", e.x + "%"); w.style.setProperty("--eye-y", e.y + "%"); w.style.setProperty("--eye-size", e.size + "%");
        w.style.setProperty("--clip-x", e.cx + "%"); w.style.setProperty("--clip-y", e.cy + "%");
        w.style.setProperty("--clip-rx", (e.rx * r.width / 100).toFixed(1) + "px"); w.style.setProperty("--clip-ry", (e.ry * r.height / 100).toFixed(1) + "px");
      });
    });
  }
  function setEyeOffset(x, y, rest) {
    EYES.forEach(function (e, n) {
      [e.el, turnEyes[n]].forEach(function (w) {
        w.classList.toggle("is-resting", !!rest);
        w.style.setProperty("--eye-shift-x", x.toFixed(2) + "px"); w.style.setProperty("--eye-shift-y", y.toFixed(2) + "px");
      });
    });
  }
  function setEyeHover(v) { var on = v && activePage() === P5; eyeR.classList.toggle("is-eye-entry-hovered", on); p5Scene.classList.toggle("is-eye-entry-hovered", on); }
  function resetEyes() { setEyeOffset(0, 0, true); setEyeHover(false); }
  if (!IS_MOBILE) {
    window.addEventListener("pointermove", function (e) {
      if (activePage() !== P5 || suspended()) return;
      var a = eyeL.querySelector(".page5-right-eye-anchor").getBoundingClientRect();
      var b = eyeR.querySelector(".page5-right-eye-anchor").getBoundingClientRect();
      var cx = (a.left + b.right) / 2, cy = (a.top + b.bottom) / 2, span = Math.max(1, b.right - a.left);
      var xr = clamp((e.clientX - cx) / (span * 0.6), -1, 1), yr = clamp((e.clientY - cy) / (window.innerHeight * 0.4), -1, 1);
      setEyeOffset(xr * EYE_MAX_X, yr * EYE_MAX_Y, false);
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetEyes);
    window.addEventListener("blur", resetEyes);
  }
  eyeR.addEventListener("pointerenter", function () { setEyeHover(true); });
  eyeR.addEventListener("pointerleave", function () { setEyeHover(false); });
  eyeR.addEventListener("click", function (e) { if (activePage() !== P5) return; e.preventDefault(); e.stopPropagation(); openOther(); });
  eyeR.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && activePage() === P5) { e.preventDefault(); openOther(); } });

  /* ═══ modals ═══ */
  function lockBody() {
    savedScrollY = window.scrollY;
    document.body.classList.add("modal-open");
    document.body.style.position = "fixed"; document.body.style.top = "-" + savedScrollY + "px"; document.body.style.width = "100%";
  }
  function unlockBody() {
    document.body.classList.remove("modal-open");
    document.body.style.position = ""; document.body.style.top = ""; document.body.style.width = "";
    window.scrollTo(0, savedScrollY); lastScrollY = savedScrollY;
  }
  function resumeAfterModal() {
    var i = activePage();
    if (SEGMENTS[i] && !playback[i].done) video.play().catch(function () {});
  }

  var galleryRendered = false;
  var LABEL = { "design-system": "Design system", graphic: "Graphic work", photography: "Photography work" };
  function renderGallery() {
    if (galleryRendered) return; galleryRendered = true;
    var n = 0, others = window.NOCTELLE_DATA.others;
    Object.keys(others).forEach(function (cat) {
      others[cat].forEach(function (name) {
        var fig = document.createElement("figure");
        fig.className = "other-project-card"; fig.dataset.category = cat;
        var img = new Image();
        img.alt = LABEL[cat] + " " + (++n); img.loading = "lazy"; img.decoding = "async";
        img.onload = function () { fig.classList.add("is-loaded"); };
        img.src = "assets/img/others/" + name + ".webp";
        fig.appendChild(img); otherGallery.appendChild(fig);
      });
    });
  }
  function openOther() {
    if (otherOpen) return;
    otherOpen = true; video.pause();
    renderGallery();
    otherModal.classList.add("is-open"); otherModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("other-projects-open");
    lockBody(); setEyeHover(false);
    otherModal.querySelector(".pt-close").focus({ preventScroll: true });
  }
  function closeOther() {
    if (!otherOpen) return;
    otherOpen = false;
    otherModal.classList.remove("is-open"); otherModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("other-projects-open");
    unlockBody(); resumeAfterModal();
  }
  otherModal.querySelectorAll("[data-other-projects-close]").forEach(function (c) { c.addEventListener("click", closeOther); });

  var introLang = "id";
  function setIntroLang(l) {
    introLang = l === "en" ? "en" : "id";
    introModal.querySelectorAll("[data-intro-lang]").forEach(function (b) { b.hidden = b.getAttribute("data-intro-lang") !== introLang; });
    introLangBtn.textContent = introLang === "id" ? "English Version" : "Versi Indonesia";
    introLangBtn.setAttribute("aria-label", introLang === "id" ? "Ganti ke versi Inggris" : "Switch to Indonesian version");
    introModal.querySelector(".intro-modal__scroll").scrollTop = 0;
  }
  var introTimer = 0, introLastFocus = null;
  function openIntro() {
    if (introOpen) return;
    introOpen = true; video.pause();
    introLastFocus = document.activeElement;
    clearTimeout(introTimer);
    setIntroLang(introLang);
    introModal.hidden = false; introModal.classList.add("is-visible"); introModal.setAttribute("aria-hidden", "false");
    introModal.classList.remove("is-closing");
    lockBody();
    requestAnimationFrame(function () { requestAnimationFrame(function () { introModal.classList.add("is-active"); }); });
    $("introCloseBtn").focus({ preventScroll: true });
  }
  function closeIntro() {
    if (!introOpen) return;
    introOpen = false;
    introModal.classList.add("is-closing"); introModal.classList.remove("is-active");
    introTimer = setTimeout(function () {
      introModal.hidden = true; introModal.classList.remove("is-visible", "is-closing"); introModal.setAttribute("aria-hidden", "true");
      unlockBody(); resumeAfterModal();
      if (introLastFocus && introLastFocus.focus) introLastFocus.focus({ preventScroll: true });
    }, 280);
  }
  $("introOpenBtn").addEventListener("click", function (e) { e.preventDefault(); setDropdown(false); openIntro(); });
  $("introCloseBtn").addEventListener("click", closeIntro);
  introModal.querySelector(".intro-modal__shader").addEventListener("click", closeIntro);
  introModal.querySelector(".intro-modal__stage").addEventListener("click", function (e) { if (e.target === e.currentTarget) closeIntro(); });
  introLangBtn.addEventListener("click", function () { setIntroLang(introLang === "id" ? "en" : "id"); });

  window.addEventListener("pt:portfolio-modal-toggle", function (e) {
    var d = e.detail || {};
    if (d.isOpen) { portfolioOpen = true; video.pause(); savedScrollY = d.lockedScrollY; }
    else { portfolioOpen = false; window.scrollTo(0, d.lockedScrollY || savedScrollY); resumeAfterModal(); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setDropdown(false);
    if (introOpen) closeIntro();
    if (otherOpen) closeOther();
  });

  /* ═══ nav ═══ */
  function setDropdown(open) { dropdown.classList.toggle("is-open", open); dropdownBtn.setAttribute("aria-expanded", open ? "true" : "false"); }
  function jumpToUx() {
    if (tweenRaf) cancelAnimationFrame(tweenRaf);
    resetTurn(); clearWheelLock();
    scrollLocked = sectionScrolling = false; targetPage = null;
    if (!playback[P1].done) { playback[P1].done = true; playback[P1].frame = CONFIG.totalFrames; scrubDone = true; }
    playback[P2].done = true; playback[P2].progress = 1;
    var y = Math.round(P2 * window.innerHeight);
    window.scrollTo(0, y); lastScrollY = y;
    if (lastPage === P4) resetPage4();
    lastPage = P2;
    setVideo(P2, SEGMENTS[P2].end, false);
    snapContent(P2);
  }
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("#projectsMenuBtn")) { e.preventDefault(); setDropdown(!dropdown.classList.contains("is-open")); return; }
    var link = e.target.closest("a[data-node]");
    if (!link) return;
    e.preventDefault(); setDropdown(false);
    if (!entered) return;
    var n = Number(link.dataset.node);
    if (n === P2) { jumpToUx(); return; }
    if (activeIndexFromScroll() === P1) { playback[P1].done = true; playback[P1].frame = CONFIG.totalFrames; scrubDone = true; }
    startSectionScroll(n);
  });
  document.addEventListener("click", function (e) { if (!dropdown.contains(e.target)) setDropdown(false); });
  $("brandHome").addEventListener("click", function (e) { e.preventDefault(); if (entered && !suspended()) startSectionScroll(0); });

  /* ═══ audio ═══ */
  function updateSoundUI() { soundToggle.textContent = soundOn ? "MUTE" : "MUSIC"; soundToggle.classList.toggle("is-active", soundOn); }
  function syncAudio(force) {
    if (!entered) return;
    if (!soundOn) { audio.pause(); return; }
    audio.muted = false; audio.volume = 0.55;
    if (!audio.paused || (audioBlocked && !force)) return;
    var p = audio.play();
    if (p && p.then) p.then(function () { audioBlocked = false; }).catch(function () { audioBlocked = true; });
  }
  soundToggle.addEventListener("click", function (e) { e.preventDefault(); soundOn = !soundOn; updateSoundUI(); syncAudio(true); });
  document.addEventListener("visibilitychange", function () {
    document.body.classList.toggle("is-backgrounded", document.hidden);
    if (document.hidden) { video.pause(); audio.pause(); return; }
    lastTick = 0;
    var i = activePage();
    if (SEGMENTS[i] && !playback[i].done && !suspended()) video.play().catch(function () {});
    syncAudio();
  });

  /* ═══ enter ═══ */
  function enterWorld() {
    if (!ready || entered) return;
    entered = true;
    video.preload = "auto"; video.load();
    loader.classList.add("is-hidden");
    soundOn = true; updateSoundUI(); syncAudio(true);
    renderFrame(1);
    window.scrollTo(0, 0);
  }
  enterBtn.addEventListener("click", enterWorld);

  /* ═══ cursor ═══ */
  var cursor = $("cursor"), cCanvas = $("cursor-canvas"), cCtx = cCanvas.getContext("2d");
  var HOVER_SEL = "a, button, [data-cursor-hover], [role='tab']";
  var TRAIL = { length: 15, lerp: 0.2, maxR: 8 };
  var trail = [], trailRaf = null, trailFrames = 0, trailVisible = true, pointerDown = false, overInteractive = false;
  function setCursor(s) { cursor.className = "cursor cursor-" + s; }
  function updateCursor() { setCursor(pointerDown ? "click" : overInteractive ? "hover" : "default"); }
  function resizeCursorCanvas() { cCanvas.width = window.innerWidth; cCanvas.height = window.innerHeight; }
  function drawTrail() {
    trailRaf = null;
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    if (trailVisible && trailFrames > 0) {
      for (var i = 0; i < trail.length; i++) {
        var p = trail[i];
        if (i > 0) { p.x += (trail[i - 1].x - p.x) * TRAIL.lerp; p.y += (trail[i - 1].y - p.y) * TRAIL.lerp; }
        var a = (i + 1) / trail.length;
        cCtx.fillStyle = "rgba(255, 232, 153, " + a * 0.52 + ")";
        cCtx.beginPath(); cCtx.arc(p.x, p.y, TRAIL.maxR * a, 0, Math.PI * 2); cCtx.fill();
      }
      trailFrames--; trailRaf = requestAnimationFrame(drawTrail); return;
    }
    trail.length = 0;
  }
  if (!IS_MOBILE) {
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      trail.push({ x: e.clientX, y: e.clientY }); if (trail.length > TRAIL.length) trail.shift();
      cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; cursor.style.opacity = "1";
      overInteractive = e.target instanceof Element && !!e.target.closest(HOVER_SEL);
      updateCursor();
      trailFrames = TRAIL.length + 4; if (trailRaf === null) trailRaf = requestAnimationFrame(drawTrail);
    });
    document.addEventListener("pointerdown", function (e) { if (e.pointerType !== "touch") { pointerDown = true; updateCursor(); } });
    document.addEventListener("pointerup", function (e) { if (e.pointerType !== "touch") { pointerDown = false; updateCursor(); } });
    document.documentElement.addEventListener("pointerleave", function () { cursor.style.opacity = "0"; trailVisible = false; trail.length = 0; cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height); });
    document.documentElement.addEventListener("pointerenter", function () { cursor.style.opacity = "1"; trailVisible = true; });
    cursor.style.left = "-100px";
  }

  /* dappled leaf-light on page 5 (procedural, seeded so it is stable) */
  (function dapple() {
    var el = document.querySelector(".page5-dapple"); if (!el) return;
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var g = [];
    for (var i = 0; i < 70; i++) {
      var x = (rnd() * 100).toFixed(1), y = (rnd() * 100).toFixed(1);
      if (y > 30 && y < 60 && rnd() < 0.7) continue; /* keep the eyes clearer */
      var w = Math.round(14 + rnd() * 46), h = Math.round(w * (0.35 + rnd() * 0.4));
      var a = (0.35 + rnd() * 0.5).toFixed(2);
      g.push("radial-gradient(ellipse " + w + "px " + h + "px at " + x + "% " + y + "%, rgba(255,236,200," + a + "), transparent 72%)");
    }
    g.push("radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.4) 100%)");
    el.style.background = g.join(",");
  })();

  /* ═══ init ═══ */
  function onResize() {
    resizeCanvas(); resizeCursorCanvas(); layoutPage4(); layoutEyes();
    if (!sectionScrolling) { var i = activeIndexFromScroll(); window.scrollTo(0, i * window.innerHeight); }
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  resizeCanvas(); resizeCursorCanvas(); layoutPage4(); layoutEyes(); updateSoundUI();
  window.addEventListener("resize", onResize);
  window.addEventListener("wheel", handleWheel, { passive: false });
  MOBILE_QUERY.addEventListener && MOBILE_QUERY.addEventListener("change", function () { location.reload(); });
  preload();
  requestAnimationFrame(tick);

  /* debug/test hook (used by the verification scripts) */
  window.__noctelle = { go: startSectionScroll, state: function () { return { page: activePage(), playback: playback, entered: entered }; } };
})();
