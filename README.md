# The Essay Folio

A static essay blog for GitHub Pages. No build step.

## Structure
```
index.html              home (latest essays)
about.html
essays/index.html       archive with subject filter
essays/*.html           one file per essay
essays/_template.html   copy this to start a new essay
assets/css/style.css    colours + fonts (edit the :root tokens)
assets/js/main.js       site name, nav, header/footer
assets/js/essays-data.js  the list of essays (add one entry per essay)
resources/images|video|audio   all media lives here
```

## Publish a new essay
1. Copy `essays/_template.html` to `essays/my-slug.html` and write it.
2. Put media in `resources/…` and link with `../resources/...`.
3. Add an entry to `assets/js/essays-data.js`.
4. Commit and push.

## Deploy
Repo → Settings → Pages → Deploy from branch → `main` / root.
