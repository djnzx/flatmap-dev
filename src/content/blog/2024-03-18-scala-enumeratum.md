---
title: "Enum Entry Names with Enumeratum"
description: "Enumeratum gives Scala enums declarative string name transformations — and lets you override them per entry when needed"
pubDate: "Mar 18 2024"
tags: [scala, enumeratum]
---

Scala's built-in enums don't provide a clean way to control how each case maps to a string name. [Enumeratum](https://github.com/lloydmeta/enumeratum) fills that gap.

Add the dependency:

`libraryDependencies += "com.beachape" %% "enumeratum" % "1.7.3"`

## Uniform name transformation

Mix in a naming rule and every entry gets a transformed name automatically:

```scala
import enumeratum.EnumEntry._
import enumeratum._

sealed trait Color extends EnumEntry with Lowercase
object Color extends Enum[Color] {
  override def values: IndexedSeq[Color] = findValues
  case object Red extends Color
  case object Green extends Color
}
```

```scala
val c1 = Color.Red.entryName
// c1: String = "red"
val c2 = Color.Green.entryName
// c2: String = "green"
```

Switching to `Uppercase` requires only changing the mixin:

```scala
sealed trait Color extends EnumEntry with Uppercase
```

```scala
val c1 = Color.Red.entryName
// c1: String = "RED"
val c2 = Color.Green.entryName
// c2: String = "GREEN"
```

## Per-entry overrides

When requirements are inconsistent — perhaps due to a legacy API that mixes naming conventions — override `entryName` on specific entries:

```scala
import enumeratum.EnumEntry._
import enumeratum._

sealed trait Color2 extends EnumEntry with Lowercase
object Color2 extends Enum[Color2] {
  override def values: IndexedSeq[Color2] = findValues
  case object Red extends Color2
  case object Green extends Color2 {
    override def entryName: String = "GREEN"
  }
}
```

The `Lowercase` rule applies to all entries; `Green` overrides it selectively:

```scala
val c3 = Color2.Red.entryName
// c3: String = "red"
val c4 = Color2.Green.entryName
// c4: String = "GREEN"
```

The default rule handles the common case; the override handles the exception. No special-casing in the call site.
