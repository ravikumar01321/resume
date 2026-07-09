---
name: jspdf blocked by package firewall
description: jspdf install attempts (3.0.4, 2.5.2, 2.5.1) all rejected by the Replit package firewall with 403; not an age issue since old versions also failed.
---

When generating PDFs from a script (e.g. resume-maker skill), do not assume jspdf will install — it has been blocked outright across multiple versions.

**Why:** `pnpm add jspdf` (root or filtered) fails with `ERR_PNPM_FETCH_403` against the package firewall for 3.0.4, 2.5.2, and 2.5.1 alike, so it isn't a minimum-release-age issue — the package itself seems firewalled.

**How to apply:** Use `pdf-lib` (+ `@pdf-lib/fontkit` if custom fonts are needed) instead. It installs cleanly and supports manual text layout/wrapping via `font.widthOfTextAtSize`, which is enough to replicate jsPDF-style rendering (measure, wrap, draw).
