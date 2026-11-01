# Krishna Kamala Heritage

A single-page website for the homestay, built with plain HTML, CSS and a small amount of JavaScript. No build step, no framework, no dependencies.

## Run it

Open `index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then visit <http://localhost:4173>.

## What's here

```
index.html                      The whole page (incl. SEO meta + JSON-LD structured data)
styles.css                      All styles and responsive rules
script.js                       Menu, scroll reveals, gallery lightbox, contact form
robots.txt, sitemap.xml         Crawler files (sitemap includes image entries)
assets/house-illustration.svg   Illustration of the entrance porch
assets/photos/*.webp            All photographs, with descriptive SEO filenames
assets/og-image.jpg             1200×900 image for WhatsApp/Facebook/X link previews
assets/fonts/                   Self-hosted Fraunces + Manrope
assets/noise.svg                Paper-grain texture
```

The old `assets/*.jpg` files are no longer used by the page (WebP copies live in
`assets/photos/`) and can be deleted.

## Before going live (important for SEO)

1. **Domain.** The site is set up for `https://krishna-kamala-heritage-homestay.in/`
   (canonical, Open Graph, Twitter, JSON-LD, `robots.txt`, `sitemap.xml`).

2. **Contact details** (phone, address, map) are in the contact section of
   `index.html` and in the JSON-LD block (`telephone`, `address`, `geo`,
   `hasMap`). If the number changes, also update `SITE.phone` in `script.js`
   (used by the Copy button). Keep the name, address and phone identical to
   your Google Business Profile.

3. **After publishing:** add the site to Google Search Console, submit
   `sitemap.xml`, create/claim a Google Business Profile with the same name,
   address and photos, and link the website from it. Test the structured data at
   <https://search.google.com/test/rich-results>.

## Contact & map

There is no form or backend. Guests call the phone number shown in the
contact section. The map is a standard Google Maps embed of the homestay's
listing (no API key needed); "Open in Google Maps" uses the short link.

## The illustration

`assets/house-illustration.svg` is drawn from the entrance photograph: the red
gabled porch, red brick columns, jaali walls, signboard and round steps. It is a
single self-contained SVG with no external references; edit colours or details
directly in the file.

## Notes

- Fonts are self-hosted, so the page works offline and does not call Google.
- All photography is of the house itself; room photos are unedited.
- The page respects `prefers-reduced-motion` and includes a skip link, keyboard
  support for the menu and lightbox, and an accessible form.
- The site is responsive from small phones up to wide desktop screens.
# krishna-kamal-homestay
