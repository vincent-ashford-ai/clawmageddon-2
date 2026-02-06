# Clawmageddon 2 — Devlog

## 2026-02-06

### GitHub Pages Deployment Fix

**Issue:** Game wasn't rendering at https://vincent-ashford-ai.github.io/clawmageddon-2/ — blank page with no errors.

**Cause:** Vite was building with absolute asset paths (`/assets/...`) but GitHub Pages serves from the `/clawmageddon-2/` subpath. The browser was looking for assets at the root domain instead of the repo subfolder.

**Fix:** Added `base: '/clawmageddon-2/'` to `vite.config.js`:

```js
export default defineConfig({
  base: '/clawmageddon-2/',
  // ...
});
```

Rebuilt and redeployed with `npx gh-pages -d dist`.

**Lesson:** Always set `base` in Vite config when deploying to GitHub Pages (or any subpath).
