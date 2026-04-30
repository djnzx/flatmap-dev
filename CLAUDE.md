# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at localhost:4321
npm run build      # build to ./dist/
npm run preview    # preview production build locally
npm run check      # type-check + dry-run Cloudflare deploy
npm run deploy     # deploy to Cloudflare Workers
```

No test suite. Type checking is via `astro check` + `tsc` (both run in `npm run check`).

## Architecture

Astro static site blog deployed to Cloudflare Workers via `@astrojs/cloudflare`.

**Routing** is file-based under `src/pages/`:
- `blog/[...slug].astro` — dynamic routes via `getStaticPaths()` from the `blog` content collection
- `tags/[tag].astro` — one page per tag, also via `getStaticPaths()`
- `tags/index.astro` — all tags, sorted by post count
- `rss.xml.js` — RSS feed endpoint

**Content** lives in `src/content/blog/` as `.md` or `.mdx` files. The schema (defined in `src/content/config.ts`) requires `title`, `description`, `pubDate`; optionally accepts `updatedDate`, `heroImage`, and `tags: string[]`. File naming convention: `YYYY-MM-DD-slug.md`.

**Layouts and components**: `BlogPost.astro` is the only layout — it wraps every post with `Header`, `Footer`, `BaseHead` (SEO/meta), `FormattedDate`, and `Tags`. Global constants (`SITE_TITLE`, `SITE_DESCRIPTION`) live in `src/consts.ts`.

**Math rendering**: posts support LaTeX via `remark-math` + `rehype-katex`. KaTeX CSS is imported in `BlogPost.astro`.

**Deployment**: `wrangler.json` configures Cloudflare Workers with static asset binding to `./dist`. The site URL in `astro.config.mjs` is currently `https://flatmap.dev` — update when going live.
