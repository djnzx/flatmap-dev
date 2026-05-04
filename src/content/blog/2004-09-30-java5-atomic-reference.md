---
title: "Java 5. Atomic Reference"
description: "Java 5 brought AtomicReference to leverage hardware CAS, along with generics, enums, varargs, and more"
pubDate: "Sep 30 2004"
tags: [intel, cas, atomic]
---

Notable Java 5 features:

- Generics!
- `AtomicReference` was introduced to leverage [i486](/i486dx/) CMPXCHG instruction —
  now we can stop using `synchronized`, but it's hard to do
  because it metastasized into the whole codebase
- varargs
- enums
- auto boxing/unboxing
- foreach loop
