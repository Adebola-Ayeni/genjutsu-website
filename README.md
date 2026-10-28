# GenjutsuCODM creator website

A responsive creator website built with plain HTML, CSS, and JavaScript. It is designed around Genjutsu as a creator brand, with CODM as the current core rather than the only possible future category.

## Run locally

Open `index.html` in a browser, or use a local static server (recommended if testing fetch/API functionality). No build step is required.

## Included

- Responsive navigation and mobile menu
- Dark/light theme toggle with a saved preference
- Reduced-motion support and scroll reveals
- YouTube channel links throughout
- Optional recent-video integration using the YouTube Data API v3
- Honest fallback links when the API is not configured
- SEO and Open Graph metadata

## YouTube API (optional)

The website works without an API key. To load actual recent video titles, thumbnails, dates, and view counts:

1. Create a YouTube Data API v3 key in Google Cloud Console.
2. Deploy the project to Vercel.
3. Add `YOUTUBE_API_KEY` in the Vercel project's Environment Variables.
4. Redeploy.

The API key belongs only in the hosting provider's environment variables, never in browser JavaScript or Git.

The `api/youtube.js` route uses the channel ID from the previous project configuration. Confirm the ID still resolves to the intended channel before launch.

## Before publishing

- Confirm the domain and replace `https://genjutsu.com.ng/` in the canonical Open Graph metadata if you choose a different domain.
- Add a dedicated business email when ready; the contact section intentionally links to the YouTube channel instead of pretending an unconnected form works.
- Add your own creator photo, logo, and video thumbnail/brand assets if desired.
- Only add social links that you actually own and want to promote.
- The Discord card was removed because no real invite URL was provided.
- Check that the current channel handle is `@GenjutsuCODM` before publishing.
