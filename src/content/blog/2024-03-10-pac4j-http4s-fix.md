---
title: "What was the most expensive line of code you have been paid for?"
description: "A one-word fix to an open-source library that resolved a subtle SAML authentication bug — and came with a $10,000 consulting fee"
pubDate: "Mar 10 2024"
tags: [scala, http4s, saml, pac4j]
---

Two years ago, a company paid me $10,000 for this [fix](https://github.com/pac4j/http4s-pac4j/commit/5a621500a3d5e287f28f8d71a546f70243920463) to the `http4s-pac4j` library:

```diff
-   override def getRequestContent: String =
+   override lazy val getRequestContent: String =
      bodyExtractor(request.bodyText.compile.to(Collector.string))
```

The change is a single keyword: `lazy`. Without it, the request body was consumed eagerly — before the SAML handler had a chance to read it. The body of an HTTP stream can only be read once, so by the time pac4j tried to parse the SAML response, it was already gone. Authentication silently failed.

Making the value `lazy` defers evaluation until the first access, which happens to be exactly when the SAML parser needs it. One word, correct behavior.

The bug was invisible in testing because most HTTP clients in test environments buffer the body automatically. It only surfaced in production under http4s's streaming model.
