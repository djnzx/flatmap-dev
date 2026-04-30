// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import mermaid from "astro-mermaid";
import sitemap from "@astrojs/sitemap";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    mermaid({
      theme: "forest",
      autoTheme: true,
    }),
    sitemap(),
  ],
  adapter: cloudflare(),
});
