---
title: "UUID Generation and Base64 Encoding on the Command Line"
description: "Quick reference for generating UUIDs and encoding or decoding secrets with base64 on Linux and macOS"
pubDate: "Mar 11 2024"
tags: [linux, uuidgen, base64]
---

Two tools that come up constantly when working with credentials, tokens, and configuration: `uuidgen` for generating unique identifiers and `base64` for encoding binary or sensitive data as ASCII text.

## Generate a UUID

```shell
uuidgen
```

Produces something like:

```text
40CB8E14-B8E7-4C7F-849E-76E1ACC23101
```

## Encode with base64

```shell
echo -n "my super secret" | base64
```

```text
bXkgc3VwZXIgc2VjcmV0
```

The `-n` flag suppresses the trailing newline that `echo` appends by default. This matters: without it, the newline becomes part of the input and changes the encoded output.

## Decode with base64

```shell
echo bXkgc3VwZXIgc2VjcmV0 | base64 -d
```

```text
my super secret%
```

The `%` at the end indicates there is no trailing newline in the decoded output — the shell prompt is appending it for display. This is normal.

## The `-n` flag matters

If you omit `-n` during encoding:

```text
bXkgc3VwZXIgc2VjcmV0Cg==
```

That is a different value. The input was `my super secret\n`, not `my super secret`. Decoding it will produce output without the trailing `%`:

```text
my super secret
```

Which means the decoded value contains `\n` at the end — something that can cause subtle failures when the value is used as a key or token.

## Copy directly to clipboard on macOS

```shell
echo -n "my super secret" | base64 | pbcopy
```

The encoded value `bXkgc3VwZXIgc2VjcmV0` lands in the clipboard, ready to paste.
