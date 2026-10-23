# Lakut Kashmir – Google Ads landing page

A fast, animated, single-page lead-generation site for Kashmir tour packages, ready for GitHub Pages. Plain HTML/CSS/JS, no build step.

| File | What it is |
|---|---|
| `index.html` | The landing page |
| `thank-you.html` | Shown after a form submit; fires the Google Ads lead conversion |
| `privacy.html` | Privacy policy (Google Ads requires one for lead forms) |
| `assets/js/config.js` | **The only file you normally edit:** phone, WhatsApp, Google Sheet URL, tracking IDs |
| `assets/js/main.js` | Animations, forms, popup, videos |
| `assets/js/track.js` | Google tag / Meta Pixel loader, gclid + UTM capture |
| `google-apps-script/` | Free Google Sheet + email lead capture (see its README) |

## Publish on GitHub Pages

1. Create a new repository on GitHub, e.g. `kashmir-tours` (public).
2. Push this folder to it:
   ```bash
   git remote add origin https://github.com/<your-username>/kashmir-tours.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. After about a minute the page is live at `https://<your-username>.github.io/kashmir-tours/`.

**Optional custom address** such as `offers.lakutkashmir.com`: in **Settings → Pages → Custom domain** enter it, then at your domain provider add a `CNAME` record `offers` → `<your-username>.github.io`. Tick **Enforce HTTPS** once it's available.

## Turn on lead capture & tracking (`assets/js/config.js`)

- `sheetUrl` – follow `google-apps-script/README.md`.
- `ga4` – Google Analytics 4 measurement ID (`G-…`).
- `adsId` + `adsLeadLabel` – in Google Ads: **Goals → Conversions → New → Website → Add manually**, create "Lead form submit"; copy the `AW-…` ID and the label. Optionally create "WhatsApp click" and "Call click" conversions for `adsWhatsappLabel` / `adsCallLabel`.
- `googleRating` – set e.g. `"4.9"` to show the star rating next to the review count (only use your real Google rating).

## Google Ads tips built into the page

- **Message match:** the headline, price and first package change with the ad's link:
  - `…/?pkg=honeymoon` → honeymoon headline, from ₹24,959
  - `…/?pkg=snow` → snow headline, from ₹12,499
  - `…/?pkg=group` → family headline, from ₹14,499

  It also reads keywords like "honeymoon", "snow" or "family" in `utm_campaign` / `utm_term`, so one final URL per ad group is enough. Suggested tracking template: `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_term={keyword}`.
- **gclid + UTMs** are saved with every lead, so the sheet shows which campaign and keyword produced it.
- **Speed:** images are WebP (about 2.3 MB total, lazy-loaded), and YouTube videos load only when tapped. Check the score at [pagespeed.web.dev](https://pagespeed.web.dev) after publishing.
- **Honest urgency only:** the page never shows fake timers or fake "someone just booked" pop-ups; Google Ads can disapprove ads for misleading claims.

## Before going live – please check

- Prices and inclusions were copied from lakutkashmir.com on 23 Oct 2026. Update `index.html` if they change.
- Photos come from your itinerary-builder project (`public/img/dest`). Make sure you have the rights to use each one in ads.
- Review quotes were taken from the Google reviews shown on your website (lightly trimmed with "…").
- Edit the privacy policy if you store leads somewhere other than Google Sheets / email.

## Preview locally

```bash
npx http-server . -p 5173 -c-1
```
Then open http://localhost:5173.
