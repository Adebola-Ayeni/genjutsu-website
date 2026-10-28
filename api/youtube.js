/*
 * Vercel serverless route: /api/youtube
 * Configure YOUTUBE_API_KEY in Vercel Project Settings > Environment Variables.
 * Never put the key in frontend JavaScript or commit it to source control.
 */
const CHANNEL_ID = "UCbVcnaFFSM_cS3feVAFLoPw";
const BASE = "https://www.googleapis.com/youtube/v3";
let cache = { channel: null, videos: null, expires: 0 };
const TTL = 10 * 60 * 1000;

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(503).json({ error: "YouTube API is not configured." });

  const resource = String(req.query?.resource || "channel");
  const now = Date.now();
  try {
    if (resource === "channel") {
      if (cache.channel && now < cache.expires) return res.status(200).json(cache.channel);
      const response = await fetch(`${BASE}/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${key}`);
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "YouTube API request failed." });
      const item = data.items?.[0];
      if (!item) return res.status(404).json({ error: "Channel not found." });
      const payload = {
        title: item.snippet?.title || "GenjutsuCODM",
        description: item.snippet?.description || "",
        thumbnail: item.snippet?.thumbnails?.high?.url || "",
        subscriberCount: item.statistics?.hiddenSubscriberCount ? null : Number(item.statistics?.subscriberCount),
        videoCount: Number(item.statistics?.videoCount || 0),
        viewCount: Number(item.statistics?.viewCount || 0)
      };
      cache = { ...cache, channel: payload, expires: now + TTL };
      return res.status(200).json(payload);
    }

    if (resource === "videos") {
      if (cache.videos && now < cache.expires) return res.status(200).json(cache.videos);
      const requested = Number(req.query?.max) || 6;
      const max = Math.max(1, Math.min(requested, 12));
      const channelResponse = await fetch(`${BASE}/channels?part=contentDetails&id=${CHANNEL_ID}&key=${key}`);
      const channelData = await channelResponse.json();
      if (!channelResponse.ok) return res.status(channelResponse.status).json({ error: channelData.error?.message || "Unable to read uploads playlist." });
      const playlistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!playlistId) return res.status(404).json({ error: "Uploads playlist not found." });

      const playlistResponse = await fetch(`${BASE}/playlistItems?part=snippet,contentDetails&maxResults=${max}&playlistId=${playlistId}&key=${key}`);
      const playlistData = await playlistResponse.json();
      if (!playlistResponse.ok) return res.status(playlistResponse.status).json({ error: playlistData.error?.message || "Unable to read uploads." });

      const items = playlistData.items || [];
      const ids = items.map(item => item.contentDetails?.videoId).filter(Boolean);
      let statsById = {};
      if (ids.length) {
        const statsResponse = await fetch(`${BASE}/videos?part=statistics,contentDetails&id=${ids.join(",")}&key=${key}`);
        const statsData = await statsResponse.json();
        if (statsResponse.ok) statsById = Object.fromEntries((statsData.items || []).map(item => [item.id, item.statistics || {}]));
      }
      const videos = items.map(item => {
        const id = item.contentDetails?.videoId;
        const snippet = item.snippet || {};
        const stats = statsById[id] || {};
        return {
          id,
          title: snippet.title || "Untitled upload",
          description: snippet.description || "",
          thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "",
          publishedAt: item.contentDetails?.videoPublishedAt || snippet.publishedAt || null,
          viewCount: stats.viewCount == null ? null : Number(stats.viewCount)
        };
      }).filter(video => video.id);
      cache = { ...cache, videos, expires: now + TTL };
      return res.status(200).json(videos);
    }
    return res.status(400).json({ error: `Unknown resource: ${resource}` });
  } catch (error) {
    console.error("[api/youtube] request failed", error);
    return res.status(502).json({ error: "Could not retrieve YouTube data." });
  }
};
