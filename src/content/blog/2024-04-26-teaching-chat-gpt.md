---
title: "Teaching ChatGPT About Higher-Kinded Types"
description: "An interview question about generalizing Future to an arbitrary effect type F[_] — and how ChatGPT reasoned through the constraints"
pubDate: "Apr 26 2024"
tags: [scala, fp]
---

One of my favourite interview questions is to implement this function:

```scala
def repack[A](xs: Seq[Future[A]]): Future[(Seq[A], Seq[Throwable])] = ???
```

It separates successes from failures across a sequence of futures and collects both. Not particularly difficult, and ChatGPT handles it without trouble.

The more interesting question is the generalized form:

```scala
def repack[F[_], A](xs: Seq[F[A]]): F[(Seq[A], Seq[Throwable])] = ???
```

Replace `Future` with an abstract effect type `F[_]`. What constraints does `F` need?

ChatGPT's answer:

```text
To implement the function repack with the signature
def repack[F[_], A](xs: Seq[F[A]]): F[(Seq[A], Seq[Throwable])],
you need to put constraints on F[_] that provide the necessary
functionality to work with F as a context for asynchronous computations.
Here are the constraints you need:

F[_] must be a type constructor:
This means that F must be a higher-kinded type,
which allows it to take another type (e.g., A)
and produce a concrete type (e.g., F[A]).
This constraint enables you to work with
generic effect types like Future, IO, Task, etc.

F[_] must have an instance of MonadError:
MonadError provides the ability to handle errors within the context of F.
It includes operations like flatMap for sequencing computations and raiseError
for lifting exceptions into the F context. This constraint allows you to handle
both successful results and failures within F.
```

And the implementation:

```scala
import cats.MonadError
import cats.implicits._

def repack[F[_]: MonadError[*[_], Throwable], A](xs: Seq[F[A]]): F[(Seq[A], Seq[Throwable])] =
  xs.foldLeft(MonadError[F, Throwable].pure((Seq.empty[A], Seq.empty[Throwable]))) { (acc, next) =>
    acc.flatMap { case (successes, failures) =>
      next.attempt.map {
        case Right(value) => (successes :+ value, failures)
        case Left(exception) => (successes, failures :+ exception)
      }
    }
  }
```

The reasoning is correct: `MonadError[F, Throwable]` provides `pure` for lifting values, `flatMap` for sequencing, and `attempt` for converting a potential failure into an `Either`. That is exactly the minimal constraint needed.

What's notable is that ChatGPT not only produced working code but correctly identified *why* each constraint is required — which is the harder part of the question.
