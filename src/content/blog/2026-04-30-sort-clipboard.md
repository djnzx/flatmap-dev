---
title: "Clipboard sort"
description: "Clipboard sort according to locale"
pubDate: "Apr 30 2026"
tags: [linux, sort]
---

It is extremely easy to sort the data by using Linux `sort`.

`sort` is a POSIX standard utility — it ships on every Unix-like system (Linux, BSD, **macOS**) and does exactly one thing: reads lines from stdin and writes them back in order. The key ingredient here is `LC_ALL`. Without it, `sort` uses the C locale and orders characters by raw byte value — accented letters, Cyrillic, and other non-ASCII characters end up in arbitrary positions. Setting `LC_ALL=uk_UA.UTF-8` (or any other UTF-8 locale that matches your data) tells `sort` to use the locale's collation rules.

macOS ships with `pbcopy` and `pbpaste` — two small utilities that treat the system clipboard as a plain stream. `pbpaste` writes the clipboard contents to stdout; `pbcopy` reads stdin and puts it into the clipboard. Pipe them around `sort` and you get in-place clipboard sorting without touching a file:

```sh
pbpaste | LC_ALL=uk_UA.UTF-8 sort | pbcopy
```

Five flags cover most real-world needs: `-u` removes duplicate lines, `-r` reverses the order, `-f` makes the comparison case-insensitive, `-n` sorts by numeric value instead of lexicographically (so `10` comes after `9`), and `-k` lets you sort by a specific field rather than the whole line — paired with `-t` to set a custom delimiter for CSVs or tab-separated data.

Copy a messy list, run one command, paste a clean one.
