---
title: "Updating Git Remotes After a GitHub Username Change"
description: "How to update all local repository remotes in one command after renaming a GitHub account"
pubDate: "Mar 13 2024"
tags: [git, github, sed]
---

Ten years ago I registered my GitHub account as `alexr007`. It felt fine at the time. GitHub eventually made it possible to rename accounts, and the moment I found out, I switched to `djnzx`.

The rename on GitHub's side is instant — all existing repositories redirect automatically. The problem is every repository already cloned locally still points to the old remote URL. Updating them one by one is tedious.

A single command handles it with `sed`:

```shell
git remote set-url origin $(git remote get-url origin | sed 's/alexr007/djnzx/g')
```

This reads the current remote URL, replaces the old username with the new one, and sets it back. Run it from within each repository that needs updating.
