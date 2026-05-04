---
title: "From Jekyll to Astro"
description: "Started with Ruby and Jekyll, ended up with Astro — a better fit for a simple static blog"
pubDate: "Mar 01 2024"
tags: [astro, blog]
---

I decided to create a simple static blog. The only idea: post every week one small thing I focused on or was asked about.

Started with Jekyll — the obvious choice for GitHub Pages. Went through the Ruby setup dance on macOS:

It works, but the Ruby toolchain friction (chruby, bundler, gem versions) felt like overhead for something that should be simple.

Switched to [Astro](https://astro.build) — no Ruby, no gem hell, just Node:

```shell
npm create astro@latest
npm run dev
```

Content lives in `src/content/blog/` as plain Markdown files. Frontmatter schema is minimal — `title`, `description`, `pubDate`, optional `tags`. That's it.

Every branch and every commit gets its own preview URL out of the box — no extra configuration needed.

To build and preview the production output locally before pushing:

```shell
npm run build
npm run preview
```

Merging to `master` triggers the Cloudflare pipeline and deploys automatically.

Astro was the right call. Zero framework magic in the Markdown files, fast builds, and the local dev server is instant.
