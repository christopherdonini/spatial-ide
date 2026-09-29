from analyze import *
fams=['like','ilike','like int pattern','is null','is not null','not','and flag','flag or','bare','unary minus then > 0','arith + 1 = 0','arith * 2 = 0','arith / 0 = 0','arith self * then > 0',"in mixed (1, 'x')",'in mixed (1, 1.5)','between mixed 1 AND 1.5','cmp = TRUE']
def c1(r):
    if r['plan_error']: return 'B'
    kinds=set()
    for c in r['casts']:
        if c['kind']=='column':
            ch=colcast[(c['child'],c['from'],c['to'])]
            kinds.add('F' if num(ch['fails'])!='0' else ('R' if num(ch['rounds'])!='0' else 'W'))
        elif c['kind']=='constant': kinds.add('n' if c['from']=='NULL' else 'L')
        else: kinds.add('?')
    s=''.join(sorted(kinds)) or '.'
    if r['exec'].startswith('EXEC_ERR'): s+='$' if leak(r).startswith('LEAK') else '!'
    s3=r['stage3_today']
    if s3!='ADMITTED' and not r['plan_error']: s+='*'+s3[:3]
    if s3=='ADMITTED' and r['plan_error']: s+='(s3 adm!)'
    if s3.startswith('NOT_BOOLEAN'): s+='#NB'
    return s
print('%-24s'%'form'+' '.join('%-6s'%c for c in COLS))
for f in fams:
    print('%-24s'%f[:24]+' '.join('%-6s'%c1([x for x in cases if x['family']==f and x['column']==col][0]) for col in COLS))
