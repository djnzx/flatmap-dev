---
title: "Object Creation and Incomplete State"
description: "Java's default constructor silently allows partially initialized objects — a constructor with parameters closes that gap"
pubDate: "Mar 08 2024"
tags: [java, encapsulation]
---

Consider this class:

```java
class Point {
  int x;
  int y;
}
```

The problem is subtle. Java generates a no-argument constructor by default, so this compiles without complaint:

```java
Point p = new Point();
p.x = 10;
```

The object is incomplete. `x` is 10, `y` is 0 — but only because Java zero-initializes fields. There is no way to distinguish this from a `Point` where `y` was intentionally set to zero:

```java
Point p = new Point();
p.x = 10;
p.y = 0;
```

The two are indistinguishable, which is the root of the problem.

The fix is to define an explicit constructor:

```java
class Point {
  int x;
  int y;

  Point(int x, int y) {
    this.x = x;
    this.y = y;
  }
}
```

Once any constructor is defined, Java stops generating the default one. This means:

```java
Point p = new Point();
```

no longer compiles. The only valid construction is:

```java
Point p = new Point(3, 5);
```

A `Point` now cannot exist in a partially initialized state — the type itself enforces completeness.
