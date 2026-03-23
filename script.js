const contentFiles = {
  albums: "./content/albums.json",
  music: "./content/music.json",
  videos: "./content/videos.json",
  writings: "./content/writings.json",
  updates: "./content/updates.json",
};

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

async function fetchContent(path) {
  const cacheBustedPath = `${path}?v=${Date.now()}`;
  const response = await fetch(cacheBustedPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

function renderAlbums(albums) {
  const mount = document.getElementById("album-list");
  mount.innerHTML = albums
    .map(
      (album) => `
        <article class="album-card">
          <img class="album-cover" src="${escapeHtml(album.coverImage)}" alt="${escapeHtml(album.title)} cover" loading="lazy">
          <div class="album-content">
            <h3>${escapeHtml(album.title)}</h3>
            ${album.description ? `<p>${escapeHtml(album.description)}</p>` : ""}
            <a class="album-link" href="${escapeHtml(album.link)}">Open album</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderMusic(items) {
  const mount = document.getElementById("music-list");
  mount.innerHTML = items
    .map((item) => {
      if (item.audioUrl) {
        return `
        <article class="embed-card">
          <h3>${escapeHtml(item.title)}</h3>
          <audio class="audio-embed" controls preload="none">
            <source src="${escapeHtml(item.audioUrl)}" type="audio/wav">
            Your browser does not support audio playback.
          </audio>
        </article>
      `;
      }
      return `
        <article class="embed-card">
          <h3>${escapeHtml(item.title)}</h3>
          <iframe
            class="bandcamp-embed"
            src="${escapeHtml(item.embedUrl)}"
            title="${escapeHtml(item.title)}"
            seamless
          ></iframe>
        </article>
      `;
    })
    .join("");
}

function toYouTubeEmbed(url) {
  const direct = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (!direct) return "";
  return `https://www.youtube.com/embed/${direct[1]}`;
}

function renderVideos(items) {
  const mount = document.getElementById("video-list");
  const cards = items
    .map((item) => {
      const embedUrl = toYouTubeEmbed(item.url);
      if (!embedUrl) {
        return `
          <article class="video-card">
            <div class="video-content">
              <h3>${escapeHtml(item.title)}</h3>
              <p>Invalid YouTube URL.</p>
            </div>
          </article>
        `;
      }
      return `
        <article class="video-card">
          <iframe
            class="video-frame"
            src="${escapeHtml(embedUrl)}"
            title="${escapeHtml(item.title)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <div class="video-content">
            <h3>${escapeHtml(item.title)}</h3>
          </div>
        </article>
      `;
    })
    .join("");

  mount.innerHTML = cards || "<p>No videos yet.</p>";
}

function renderWritings(items) {
  const mount = document.getElementById("writing-list");
  mount.innerHTML = items
    .map(
      (item) => `
        <article class="writing-item">
          <h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3>
          ${item.excerpt ? `<p>${escapeHtml(item.excerpt)}</p>` : ""}
        </article>
      `
    )
    .join("");
}

function renderUpdates(items) {
  const mount = document.getElementById("update-list");
  const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  mount.innerHTML = sorted
    .map(
      (item) => `
        <li>
          <span class="update-date">${escapeHtml(item.date)}</span>
          <span>${escapeHtml(item.text)}</span>
        </li>
      `
    )
    .join("");
}

async function init() {
  try {
    const wantsAlbums = Boolean(document.getElementById("album-list"));
    const wantsMusic = Boolean(document.getElementById("music-list"));
    const wantsVideos = Boolean(document.getElementById("video-list"));
    const wantsWritings = Boolean(document.getElementById("writing-list"));
    const wantsUpdates = Boolean(document.getElementById("update-list"));

    const jobs = [];
    if (wantsAlbums) jobs.push(fetchContent(contentFiles.albums));
    if (wantsMusic) jobs.push(fetchContent(contentFiles.music));
    if (wantsVideos) jobs.push(fetchContent(contentFiles.videos));
    if (wantsWritings) jobs.push(fetchContent(contentFiles.writings));
    if (wantsUpdates) jobs.push(fetchContent(contentFiles.updates));

    const loaded = await Promise.all(jobs);
    let i = 0;

    if (wantsAlbums) renderAlbums(loaded[i++]);
    if (wantsMusic) renderMusic(loaded[i++]);
    if (wantsVideos) renderVideos(loaded[i++]);
    if (wantsWritings) renderWritings(loaded[i++]);
    if (wantsUpdates) renderUpdates(loaded[i++]);
  } catch (error) {
    console.error(error);
  }
}

init();
