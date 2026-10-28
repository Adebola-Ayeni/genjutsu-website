/* Loads live YouTube channel stats and recent uploads through the Vercel API route. */
(() => {
  const CHANNEL_URL = "https://www.youtube.com/@GenjutsuCODM";
  const API_ENDPOINT = "/api/youtube";
  const formatDate = value => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
  };
  const formatNumber = value => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  const formatFullNumber = value => new Intl.NumberFormat("en").format(value);
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function renderVideo(video) {
    const id = encodeURIComponent(video.id);
    const title = escapeHTML(video.title || "Watch on YouTube");
    const thumb = escapeHTML(video.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    return `<article class="video-card">
      <a class="video-card__thumb" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${title}">
        <img src="${thumb}" alt="" loading="lazy" decoding="async">
      </a>
      <div class="video-card__body">
        <h3 class="video-card__title"><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
        <div class="video-card__meta"><span>${escapeHTML(formatDate(video.publishedAt))}</span>${Number.isFinite(video.viewCount) ? `<span>${escapeHTML(formatNumber(video.viewCount))} views</span>` : ""}</div>
      </div>
    </article>`;
  }
  async function request(resource, params = "") {
    const query = `?resource=${encodeURIComponent(resource)}${params ? `&${params}` : ""}`;
    const response = await fetch(`${API_ENDPOINT}${query}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`YouTube endpoint returned ${response.status}`);
    return response.json();
  }
  async function loadStats() {
    const note = document.getElementById("stats-note");
    try {
      const stats = await request("channel");
      const subscribers = document.getElementById("stat-subscribers");
      const views = document.getElementById("stat-views");
      const videos = document.getElementById("stat-videos");
      if (subscribers) subscribers.textContent = typeof stats.subscriberCount === "number" ? formatFullNumber(stats.subscriberCount) : "Hidden";
      if (views) views.textContent = formatNumber(stats.viewCount || 0);
      if (videos) videos.textContent = formatFullNumber(stats.videoCount || 0);
      if (note) note.textContent = `Live channel data for ${stats.title || "GenjutsuCODM"}. Subscriber counts may be hidden or rounded by YouTube.`;
      const dataNote = document.getElementById("data-note");
      if (dataNote) dataNote.textContent = `Channel connected: ${formatNumber(stats.subscriberCount || 0)} subscribers · ${formatNumber(stats.viewCount || 0)} total views.`;
    } catch (error) {
      if (note) note.textContent = "Channel stats are temporarily unavailable. Check the Vercel YouTube API configuration.";
      console.info("[Genjutsu] Could not load YouTube channel statistics.");
    }
  }
  async function loadVideos() {
    const grid = document.getElementById("video-grid");
    const status = document.getElementById("library-status");
    const featuredTitle = document.getElementById("featured-title");
    const featuredLink = document.getElementById("featured-link");
    const featuredThumb = document.querySelector(".featured-thumb");
    if (!grid) return;
    try {
      const videos = await request("videos", "max=6");
      if (!Array.isArray(videos) || !videos.length) return;
      grid.innerHTML = videos.slice(0, 6).map(renderVideo).join("");
      if (status) status.textContent = "LATEST UPLOADS";
      if (featuredTitle) featuredTitle.textContent = videos[0].title || "Latest upload";
      if (featuredLink) featuredLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videos[0].id)}`;
      if (featuredThumb) {
        featuredThumb.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videos[0].id)}`;
        const art = featuredThumb.querySelector(".thumb-art");
        if (art && videos[0].thumbnail) {
          art.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.28), rgba(0,0,0,.05)), url("${videos[0].thumbnail.replace(/["\\]/g, "")}")`;
          art.style.backgroundSize = "cover";
          art.style.backgroundPosition = "center";
        }
      }
    } catch (error) {
      console.info("[Genjutsu] Recent uploads unavailable; fallback links remain active.");
    }
  }
  document.addEventListener("DOMContentLoaded", () => { loadStats(); loadVideos(); });
})();
