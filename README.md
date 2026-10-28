# GenjutsuCODM creator website

Responsive creator website built with plain HTML, CSS and JavaScript, with Vercel serverless routes for YouTube data and contact-form email.

## Deploy to Vercel

1. Push the contents of this folder to a GitHub repository or import the project directly into Vercel.
2. In Vercel, open **Project Settings → Environment Variables**.
3. Add the variables below to **Preview** and **Production**.
4. Redeploy after saving environment variables.

## Environment variables

### YouTube channel data

- `YOUTUBE_API_KEY`: YouTube Data API v3 key from Google Cloud. Enable **YouTube Data API v3** for the Google Cloud project.

This powers the live subscriber count, total channel views, total uploaded videos, and recent-upload cards. The API route uses the configured channel ID in `api/youtube.js`; verify it is the correct channel before launch.

### Contact form email

The contact form sends submissions to **genjutsucodm@gmail.com** using Resend.

- `RESEND_API_KEY`: API key created in your [Resend dashboard](https://resend.com/api-keys).
- `RESEND_FROM_EMAIL`: A sender identity on a domain verified in Resend, for example `Genjutsu Website <website@your-verified-domain.com>`. Replace the example with an actual sender address on a domain you have verified.

Steps:

1. Create a Resend account and add a domain you control.
2. Follow Resend's DNS instructions to verify that domain.
3. Create an API key and add both environment variables in Vercel.
4. Select **Preview** and **Production** for both variables if you want the contact form to work on preview deployments and the live site.
5. Redeploy and test the form using an email address you can access.

The sender domain must be verified by Resend; the recipient is fixed in `api/contact.js` as `genjutsucodm@gmail.com`. Replies from the inbox can be sent directly to the visitor because the visitor's address is included as `reply_to`. Do not put API keys in frontend JavaScript or commit them to Git.

Resend may restrict sending while an account is in testing mode. Complete its sender/domain verification before relying on the form for public enquiries.

## Local preview

Open `index.html` for a static preview. The Vercel API routes (`/api/youtube` and `/api/contact`) require Vercel deployment or a compatible local Vercel dev environment to work.

## Before publishing

- Confirm the domain in the Open Graph metadata matches your final domain.
- Confirm the YouTube channel ID and current channel handle are correct.
- Test contact-form delivery and reply-to behavior.
- The contact form includes basic validation and a hidden honeypot field; add stronger rate limiting if the form receives spam.

## Channel profile picture

The same image file is reused across the header, hero artwork, featured-video artwork, creator section, and footer: `images/genjutsu-profile.png`. Replace that file with your YouTube channel profile picture (keep the same filename and PNG format) and it will update across the website automatically. The included image is only a temporary placeholder. The rotating rings and animated portrait treatment are preserved.
