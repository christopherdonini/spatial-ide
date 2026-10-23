# questions-mirror-item-count: the I1 and I2 runs (§3, §6)

*The custodian's record (2026-10-23): the four outputs of the worker's two scratch scripts, byte-copied from its scratch folder, each under the commit it ran at (B c7e94a85c5d21f3910c6c15ee9ce1d6071ca6189, the head 0f93c12264879535ac40de1d87f0139bc927fbf5). I1 runs the shipped `countItems` over every `state/questions/round-*.md`; I2 runs the shipped hook for rounds 36 to 73 in temporary projects, its environment holding `CUSTODIAN_TELEGRAM_DRY_RUN=1` and no token or chat id, each run printing the dry-run line once. Each block's sha256 is over its text with one final newline. The worker's report: `state/consults/2026-10-23-questions-mirror-item-count-worker-report.md`.*

## I1 at B (c7e94a85), sha256 3f8cd3b79f0d23b45f84feb1447402f57ef42e31967b57296c0e44d91c8c5fd1

```text
round	count	headerK
1	2	-
2	2	-
3	3	-
4	1	-
5	4	-
6	2	-
7	1	-
8	3	-
9	1	-
10	1	-
11	4	-
12	4	-
13	1	-
14	4	-
15	4	-
16	1	-
17	9	-
18	4	-
19	2	-
20	1	-
21	3	-
22	5	-
23	5	-
24	5	-
25	5	-
26	5	-
27	7	-
28	4	-
29	7	-
30	2	-
31	3	-
32	5	-
33	12	-
34	8	-
35	2	-
36	2	1
37	2	1
38	2	1
39	2	1
40	5	4
41	5	4
42	4	3
43	5	4
44	3	2
45	3	2
46	5	4
47	2	1
48	2	1
49	3	2
50	4	3
51	4	3
52	5	4
53	2	1
54	3	2
55	4	3
56	2	1
57	5	4
58	2	1
59	5	4
60	2	1
61	4	3
62	5	4
63	5	4
64	2	1
65	3	2
66	5	4
67	4	3
68	2	1
69	5	4
70	5	4
71	2	1
72	2	1
73	5	4
```

## I1 at the head (0f93c122), sha256 acb38597d4863bcf7878de884207a6a773150b5c7579111275d185ca58878509

```text
round	count	headerK
1	0	-
2	2	-
3	3	-
4	1	-
5	4	-
6	2	-
7	1	-
8	3	-
9	1	-
10	1	-
11	4	-
12	4	-
13	1	-
14	4	-
15	4	-
16	5	-
17	9	-
18	4	-
19	2	-
20	1	-
21	2	-
22	3	-
23	4	-
24	4	-
25	4	-
26	4	-
27	6	-
28	3	-
29	6	-
30	1	-
31	2	-
32	0	-
33	11	-
34	7	-
35	1	-
36	1	1
37	1	1
38	1	1
39	1	1
40	4	4
41	4	4
42	3	3
43	4	4
44	2	2
45	2	2
46	4	4
47	1	1
48	1	1
49	2	2
50	3	3
51	3	3
52	4	4
53	1	1
54	2	2
55	3	3
56	1	1
57	4	4
58	1	1
59	4	4
60	1	1
61	3	3
62	4	4
63	4	4
64	1	1
65	2	2
66	4	4
67	3	3
68	1	1
69	4	4
70	4	4
71	1	1
72	1	1
73	4	4
```

## I2 at B (c7e94a85), sha256 fc4b2a2decb4c75934476db25cb2bcbdd0f0036dd05cb21249684da3539788b3

```text
round	committed	rerun	dry-run-line
36	none	none	q=1/k=1	dry=1	status=0
37	none	none	q=1/k=1	dry=1	status=0
38	none	none	q=1/k=1	dry=1	status=0
39	none	none	q=1/k=1	dry=1	status=0
40	1	1	q=4/k=4	dry=1	status=0
41	1	1	q=4/k=4	dry=1	status=0
42	1	1	q=3/k=3	dry=1	status=0
43	none	none	q=4/k=4	dry=1	status=0
44	none	none	q=2/k=2	dry=1	status=0
45	none	none	q=2/k=2	dry=1	status=0
46	none	none	q=4/k=4	dry=1	status=0
47	none	none	q=1/k=1	dry=1	status=0
48	none	none	q=1/k=1	dry=1	status=0
49	none	none	q=2/k=2	dry=1	status=0
50	none	none	q=3/k=3	dry=1	status=0
51	none	none	q=3/k=3	dry=1	status=0
52	none	none	q=4/k=4	dry=1	status=0
53	none	none	q=1/k=1	dry=1	status=0
54	none	none	q=2/k=2	dry=1	status=0
55	none	none	q=3/k=3	dry=1	status=0
56	none	none	q=1/k=1	dry=1	status=0
57	none	none	q=4/k=4	dry=1	status=0
58	none	none	q=1/k=1	dry=1	status=0
59	none	none	q=4/k=4	dry=1	status=0
60	none	none	q=1/k=1	dry=1	status=0
61	none	none	q=3/k=3	dry=1	status=0
62	none	none	q=4/k=4	dry=1	status=0
63	none	none	q=4/k=4	dry=1	status=0
64	none	none	q=1/k=1	dry=1	status=0
65	none	none	q=2/k=2	dry=1	status=0
66	none	none	q=4/k=4	dry=1	status=0
67	none	none	q=3/k=3	dry=1	status=0
68	none	none	q=1/k=1	dry=1	status=0
69	none	none	q=4/k=4	dry=1	status=0
70	none	none	q=4/k=4	dry=1	status=0
71	none	none	q=1/k=1	dry=1	status=0
72	none	none	q=1/k=1	dry=1	status=0
73	none	none	q=4/k=4	dry=1	status=0
```

## I2 at the head (0f93c122), sha256 12d2a10e5db38e5a2fc8f3096340c6c41ee2a08e67ddecfcbb92df08769d507d

```text
round	committed	rerun	dry-run-line
36	none	none	q=1/k=1	dry=1	status=0
37	none	none	q=1/k=1	dry=1	status=0
38	none	none	q=1/k=1	dry=1	status=0
39	none	none	q=1/k=1	dry=1	status=0
40	1	1	q=4/k=4	dry=1	status=0
41	1	1	q=4/k=4	dry=1	status=0
42	1	1	q=3/k=3	dry=1	status=0
43	none	none	q=4/k=4	dry=1	status=0
44	none	none	q=2/k=2	dry=1	status=0
45	none	2	q=2/k=2	dry=1	status=0
46	none	3	q=4/k=4	dry=1	status=0
47	none	none	q=1/k=1	dry=1	status=0
48	none	none	q=1/k=1	dry=1	status=0
49	none	none	q=2/k=2	dry=1	status=0
50	none	none	q=3/k=3	dry=1	status=0
51	none	none	q=3/k=3	dry=1	status=0
52	none	1, 3	q=4/k=4	dry=1	status=0
53	none	1	q=1/k=1	dry=1	status=0
54	none	1, 2	q=2/k=2	dry=1	status=0
55	none	1, 3	q=3/k=3	dry=1	status=0
56	none	1	q=1/k=1	dry=1	status=0
57	none	1, 2, 3, 4	q=4/k=4	dry=1	status=0
58	none	1	q=1/k=1	dry=1	status=0
59	none	1, 2, 4	q=4/k=4	dry=1	status=0
60	none	none	q=1/k=1	dry=1	status=0
61	none	1	q=3/k=3	dry=1	status=0
62	none	2, 3, 4	q=4/k=4	dry=1	status=0
63	none	1, 3, 4	q=4/k=4	dry=1	status=0
64	none	none	q=1/k=1	dry=1	status=0
65	none	none	q=2/k=2	dry=1	status=0
66	none	none	q=4/k=4	dry=1	status=0
67	none	none	q=3/k=3	dry=1	status=0
68	none	none	q=1/k=1	dry=1	status=0
69	none	none	q=4/k=4	dry=1	status=0
70	none	none	q=4/k=4	dry=1	status=0
71	none	none	q=1/k=1	dry=1	status=0
72	none	none	q=1/k=1	dry=1	status=0
73	none	none	q=4/k=4	dry=1	status=0
```
