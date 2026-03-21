# benjo-site

A beautiful, artistic, minimal static website designed for GitHub Pages.

## Included features

- Photo gallery with multiple albums
- Music section with Bandcamp embeds
- Videos section with YouTube embeds
- Writings / essays section
- Updates feed

## Site structure

- `index.html` - landing page
- `gallery.html` - photo albums
- `music.html` - Bandcamp embeds
- `videos.html` - YouTube embeds
- `writings.html` - essay index
- `updates.html` - updates feed

## Content editing

Section content is data-driven through JSON files:

- `content/albums.json`
- `content/music.json`
- `content/videos.json`
- `content/writings.json`
- `content/updates.json`

Essay pages are in `writings/`.

## Local preview

From the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy on GitHub Pages

1. Create a GitHub repo and push this project.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, set:
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Save and wait for deployment.

Your site will be available at:

`https://<your-github-username>.github.io/<repo-name>/`
