---
title: "SQL Interview: Repeating Rows Based on a Ratio"
description: "Two approaches to expanding rows by a computed repetition count — using generate_series and using array_fill with unnest"
pubDate: "Nov 11 2024"
tags: [sql, interview]
---

Given a table with a `ratio` column, expand each row so that it appears `ceil(1/ratio)` times in the output.

| data | ratio |
| :--- | :---: |
| a    |  0.3  |
| b    |  0.5  |
| c    |  0.4  |
| d    |  1.0  |

Expected output:

| value |
| :---- |
| a     |
| a     |
| a     |
| a     |
| b     |
| b     |
| c     |
| c     |
| c     |
| d     |

## Setup

```sql
create table public.log
(
    data  text,
    ratio double precision
);
INSERT INTO public.log (data, ratio) VALUES ('a', 0.3);
INSERT INTO public.log (data, ratio) VALUES ('b', 0.5);
INSERT INTO public.log (data, ratio) VALUES ('c', 0.4);
INSERT INTO public.log (data, ratio) VALUES ('d', 1);
```

Verify the source data:

```sql
select data, ratio from log;
```

| value | ratio |
| :---- | :---: |
| a     |  0.3  |
| b     |  0.5  |
| c     |  0.4  |
| d     |  1.0  |

Compute the repetition count per row:

```sql
select data, ceil(1/ratio) from log;
```

| value | ceil |
| :---- | :--: |
| a     |  4   |
| b     |  2   |
| c     |  3   |
| d     |  1   |

## Approach 1: generate_series

`generate_series` produces a set of integers from 1 to N. Joining each row against a series of the appropriate length repeats it the right number of times:

```sql
SELECT generate_series(1, ceil(1/.2)::integer);
```

| value |
| :---- |
| 1     |
| 2     |
| 3     |
| 4     |
| 5     |

Applied to the full table:

```sql
select data
  from log
  join generate_series(1, ceil(1/ratio)::integer) as series on true;
```

| value |
| :---- |
| a     |
| a     |
| a     |
| a     |
| b     |
| b     |
| c     |
| c     |
| c     |
| d     |

## Approach 2: array_fill + unnest

An alternative using `array_fill` to construct an array of the target length, then `unnest` to expand it into rows.

`array_fill` creates an array of a given value repeated N times:

```sql
SELECT array_fill(0, ARRAY[5]);
```

| value       |
| :---------- |
| {0,0,0,0,0} |

`unnest` explodes an array into individual rows:

```sql
SELECT unnest(array_fill(0, ARRAY[5]));
```

| value |
| :---- |
| 0     |
| 0     |
| 0     |
| 0     |
| 0     |

Combine with the source table:

```sql
select l.data
  from log l
  join unnest(array_fill(0, ARRAY[ceil(1/l.ratio)::integer])) on true;
```

| value |
| :---- |
| a     |
| a     |
| a     |
| a     |
| b     |
| b     |
| c     |
| c     |
| c     |
| d     |

Both approaches produce the same result. `generate_series` is more idiomatic for integer ranges; `array_fill` + `unnest` is useful when working with existing array data or when the range logic is more complex.
