---
title: "SQL Interview: Finding a Missing Number in a Sequence"
description: "A step-by-step walkthrough of finding a gap in an integer sequence using a self-join and RIGHT OUTER JOIN"
pubDate: "Oct 10 2024"
tags: [sql, interview]
---

Given a table with an integer sequence that has one gap, find the missing value.

| c1  |
| :-- |
| 1   |
| 2   |
| 3   |
| 4   |
| 6   |
| 7   |
| 8   |
| 9   |

The missing number is `5`. The goal is to find it with SQL, without hardcoding the expected range.

## Setup

```sql
CREATE TABLE t1(c1 integer);

INSERT INTO t1 (c1)
VALUES (1),
       (2),
       (3),
       (4),
       (6),
       (7),
       (8),
       (9);
```

## Strategy

The idea is to shift the sequence by one and join it against the original. Any value that appears in the shifted sequence but has no match in the original is a gap.

Shift the sequence:

```sql
select c1 + 1 from t1;
```

| ?column? |
| :------- |
| 2        |
| 3        |
| 4        |
| 5        |
| 7        |
| 8        |
| 9        |
| 10       |

The value `5` appears here but not in the original table. A `RIGHT OUTER JOIN` exposes this: rows from the right side with no match on the left will have `NULL` in the left column.

```sql
select c1,c2
from t1
right outer join (
                  select c1 + 1 as c2
                  from t1
                 ) as t2 on (t2.c2 = t1.c1);
```

| c1   | c2  |
| :--- | :-- |
| 2    | 2   |
| 3    | 3   |
| 4    | 4   |
| null | 5   |
| 7    | 7   |
| 8    | 8   |
| 9    | 9   |
| null | 10  |

Filter to rows where `c1 IS NULL` to get the gaps:

```sql
select c2
from t1
right outer join (select c1 + 1 as c2 from t1) as t2 on (t2.c2 = t1.c1)
where c1 is null;
```

| c2  |
| :-- |
| 5   |
| 10  |

`10` appears because it is one past the maximum value — a natural artifact of the shift. Add `ORDER BY` and `LIMIT 1` to return only the first true gap:

```sql
select c2
from t1
         right outer join (select c1 + 1 as c2 from t1) as t2 on (t2.c2 = t1.c1)
where c1 is null
order by c2
limit 1
```

| c2  |
| :-- |
| 5   |
