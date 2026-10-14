/* Shared layout + essay listing logic. No build step, no dependencies. */
(function () {
  var SITE = {
    name: "The Essay Folio",
    tagline: "Long-form essays, irregularly published",
    author: "Your Name",
    year: new Date().getFullYear(),
    nav: [
      ["Essays", "essays/"],
      ["About", "about.html"]
    ]
  };

  var root = document.body.getAttribute("data-root") || "";
  var page = document.body.getAttribute("data-page") || "";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
  var essays = (window.ESSAYS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });

  function fmtDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.getDate() + " " + d.toLocaleString("en-GB", { month: "short" }) + " " + d.getFullYear();
  }
  function url(e) { return root + "essays/" + e.slug + ".html"; }
  function catUrl(c) { return root + "essays/?category=" + encodeURIComponent(c); }

  /* ---------- header & footer ---------- */
  var cats = {};
  essays.forEach(function (e) { e.categories.forEach(function (c) { cats[c] = (cats[c] || 0) + 1; }); });
  var catNames = Object.keys(cats).sort();

  var nav = SITE.nav.map(function (n) {
    var cur = (n[1].indexOf(page) === 0 && page) ? ' aria-current="page"' : "";
    return '<a href="' + root + n[1] + '"' + cur + ">" + n[0] + "</a>";
  }).join("");

  var header = $("#site-header");
  if (header) header.innerHTML =
    '<div class="wrap"><a class="brand" href="' + root + 'index.html">' +
    '<img src="' + root + 'resources/images/logo.png" alt="" width="92" height="86">' +
    '<span class="brand-name">' + SITE.name + '</span>' +
    '<span class="brand-tag">' + SITE.tagline + '</span></a>' +
    '<nav class="nav" aria-label="Main">' + nav + "</nav></div>";

  var footer = $("#site-footer");
  if (footer) footer.innerHTML =
    '<div class="wrap"><div><h3>' + SITE.name + '</h3>' +
    "<p>A small publication of essays on art, books, music and the overlooked corners of history.</p></div>" +
    '<div><h3>Read</h3><ul><li><a href="' + root + 'essays/">All essays</a></li>' +
    '<li><a href="' + root + 'about.html">About</a></li></ul></div>' +
    '<div><h3>Subjects</h3><ul>' + catNames.slice(0, 6).map(function (c) {
      return '<li><a href="' + catUrl(c) + '">' + esc(c) + "</a></li>";
    }).join("") + "</ul></div></div>" +
    '<div class="copy">© ' + SITE.year + " " + esc(SITE.author) + " · Essays and original images © the author unless stated</div>";

  /* ---------- listing ---------- */
  function card(e, featured) {
    return '<article class="card' + (featured ? " featured" : "") + '">' +
      '<a class="thumb" href="' + url(e) + '" tabindex="-1" aria-hidden="true"><img loading="lazy" src="' + root + e.image + '" alt=""></a>' +
      "<div><h2><a href=\"" + url(e) + '">' + esc(e.title) + "</a></h2>" +
      '<div class="byline">By <b>' + esc(e.author) + "</b></div>" +
      "<p>" + esc(e.excerpt) + ' <a class="more" href="' + url(e) + '">Read</a></p>' +
      '<ul class="tags">' + e.categories.map(function (c) { return '<li><a href="' + catUrl(c) + '">' + esc(c) + "</a></li>"; }).join("") + "</ul>" +
      '<div class="meta">' + fmtDate(e.date) + "</div></div></article>";
  }

  var home = $("#home-list");
  if (home) {
    home.innerHTML = essays.slice(0, 4).map(function (e, i) { return card(e, i === 0); }).join("") ||
      '<p class="empty">No essays yet.</p>';
  }

  var list = $("#essay-list");
  if (list) {
    var params = new URLSearchParams(location.search);
    var active = params.get("category");
    var shown = active ? essays.filter(function (e) { return e.categories.indexOf(active) > -1; }) : essays;
    list.innerHTML = (active ? '<p class="filter-note">Showing “' + esc(active) + '” — <a href="./">show all</a></p>' : "") +
      (shown.map(function (e) { return card(e, false); }).join("") || '<p class="empty">Nothing filed under this subject yet.</p>');
    var side = $("#subjects");
    if (side) side.innerHTML = catNames.map(function (c) {
      return '<li><a href="' + catUrl(c) + '"' + (c === active ? ' aria-current="true"' : "") + ">" +
        esc(c) + "<small>" + cats[c] + "</small></a></li>";
    }).join("");
  }

  /* ---------- previous / next on essay pages ---------- */
  var pager = $("#pager");
  if (pager) {
    var slug = location.pathname.split("/").pop().replace(".html", "");
    var i = essays.findIndex(function (e) { return e.slug === slug; });
    if (i > -1) {
      var newer = essays[i - 1], older = essays[i + 1];
      pager.innerHTML =
        (older ? '<a class="prev" href="' + url(older) + '"><small>← Earlier</small><span class="title">' + esc(older.title) + "</span></a>" : "<span></span>") +
        (newer ? '<a class="next" href="' + url(newer) + '"><small>Later →</small><span class="title">' + esc(newer.title) + "</span></a>" : "<span></span>");
    }
  }
})();
