---
title: "How Boolean Can Be Complicated"
description: "A checkbox on a UI and a boolean column in a database look the same — but they carry different semantics that have to be handled carefully"
pubDate: "Apr 13 2024"
tags: [java, scala, database]
---

Consider a job board with a `remote` filter. It looks trivial — a checkbox on the UI, a boolean column in the database. But the two booleans mean different things.

From the UI perspective, the checkbox has two states:

| UI      | semantics                           |
| ------- | ----------------------------------- |
| `false` | I don't care about this filter      |
| `true`  | I want to filter `remote`-only jobs |

From the database perspective, a boolean column is used to build a `WHERE` clause:

| database | semantics                                      |
| -------- | ---------------------------------------------- |
| `false`  | we **don't include** `WHERE filter ...` clause |
| `true`   | we **include** `WHERE filter=true` clause      |

The mapping between them is asymmetric:

| UI      | database                               |
| ------- | -------------------------------------- |
| `false` | `SELECT * FROM jobs`                   |
| `true`  | `SELECT * FROM jobs WHERE remote=true` |

A UI `false` means "no filter" — not "filter for non-remote jobs." These are different queries.

## Modeling it correctly in Scala

In Scala, filters are commonly represented as `Option[A]`, defaulting to `None` when absent:

```scala
case class Filter(
  ...
  remote: Option[Boolean] = None
  ...
)

val filter: Filter = ???
```

But this introduces a subtlety. When the user checks the box, the value becomes `Some(true)`. When they uncheck it, it becomes `Some(false)` — not `None`. And `Some(false)` would generate `WHERE remote=false`, which filters for non-remote jobs. That is not what an unchecked checkbox means.

`Option` has a method that fixes this cleanly:

```scala
val x = Some(false).filter(identity)
// x: Option[Boolean] = None
```

`filter(identity)` collapses `Some(false)` to `None`, leaving `Some(true)` unchanged. Applied to the filter:

```scala
val maybeFragment: Option[Fragment] =
  filter.remote.filter(identity).map(remote => fr"remote = $remote")
```

When `remote` is `false`, `maybeFragment` is `None` — no SQL clause is added. When it is `true`, the clause is included. Correct behavior, and it composes cleanly with any other optional filter fragments.

A single boolean in a form field can carry at least three distinct meanings depending on context. Pretending otherwise leads to subtle bugs.
