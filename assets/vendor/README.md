These assets are hosted locally so public pages do not depend on third-party font servers.

- `fonts.css` and `font-*.woff2`: Cairo (weights 300–850) and Plus Jakarta Sans (300–800), downloaded from the Google Fonts CSS2 API with `display=swap`. Licenses: `cairo-OFL.txt` and `jakarta-OFL.txt`.
- `icons.css` and `fa-*.woff2`: Font Awesome Free 6.4.2 from jsDelivr. Unused TTF fallbacks were removed; the original CSS license header is retained. License: `fontawesome-LICENSE.txt`.

Keep CSS and font files together. When replacing assets, change their filenames or add a versioned directory to avoid serving an old cached version. The build copies this directory into `dist/assets/vendor`.
