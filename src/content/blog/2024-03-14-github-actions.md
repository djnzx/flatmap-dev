---
title: "First Look at GitHub Actions"
description: "Exploring the GitHub Actions YAML structure, the questions it raises, and what the action source code actually looks like"
pubDate: "Mar 14 2024"
tags: [cicd, github]
---

GitHub provides ready-made workflow YAML for common scenarios. For Jekyll + GitHub Pages, it looks like this:

```yaml
name: Deploy Jekyll site to Pages
on:
  push:
    branches: ["master"]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@8575951200e472d5f2d95c625da0c7bec8217c42
        with:
          ruby-version: "3.1"
          bundler-cache: true
          cache-version: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${ { steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

The YAML works, but reading it raises more questions than it answers:

```markdown
what are configurable root keys besides:

- `name`
- `on`
- `permissions`
- `concurrency`
- `jobs`
- `...`

what are configurable properties of `on`

- `push`
- `...`

what are configurable properties of `permissions`

- contents
- pages
- id-token
- `...`

what are configurable properties of each job

- `runs-on`
- `steps`
- `...`

what are configurable properties of each step

- `uses`, `with`
- `run`
- `env`
- `...`

where to see the source code of

- `actions/checkout@v4`
- `ruby/setup-ruby@8575951200e472d5f2d95c625da0c7bec8217c42`
- `actions/configure-pages@v4`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`
- `...`

which env vars available:

- `${ { steps.pages.outputs.base_path }}`
- `${ { steps.deployment.outputs.page_url }}`
- `...`

- how to pass information between steps and actions
```

[ChatGPT](https://chat.openai.com) helped fill in some of the gaps. One useful discovery: every action referenced by `uses:` is just a public GitHub repository. The version tag (`v4`) is a branch or tag in that repo:

- [`actions/checkout`](https://github.com/actions/checkout) — [v4 source](https://github.com/actions/checkout/tree/v4)

The source is TypeScript — which makes sense given GitHub's ownership by Microsoft. The implementation spans multiple files and is more complex than it might seem from the outside:

- [main.ts](https://github.com/actions/checkout/blob/v4/src/main.ts)
- [git-source-provider.ts](https://github.com/actions/checkout/blob/v4/src/git-source-provider.ts)

It's a solid reminder that "one line of YAML" can represent a non-trivial amount of implementation.
