# B-1 P0: derives the draft's headline counts from the probe's output (p0.jsonl in the cwd).
from analyze import *
import collections
cs=[r for r in cases if 'u_str' not in r['operand'] and 'n_str' not in r['operand'] and r['family']!='cmp = TRUE']
print('cases (excluding the mangled u_str row and the forms stage 1 refuses as CAST: n_str, cmp = TRUE):',len(cs))
adm=[r for r in cs if r['stage3_today']=='ADMITTED']
print('admitted by the stage-3 replica:',len(adm))
err=[r for r in adm if r['exec'].startswith('EXEC_ERR')]
def has_col_fail(r):
    return any(c['kind']=='column' and num(colcast[(c['child'],c['from'],c['to'])]['fails'])!='0' for c in r['casts'])
cc=collections.Counter()
for r in err:
    msg=r['exec'].split('\n')[0]
    cause='column cast fails' if has_col_fail(r) else ('overflow' if 'Overflow' in msg or 'Out of Range' in msg else ('literal conversion' if 'Conversion Error' in msg or 'Could not convert' in msg else 'other'))
    cc[(cause, 'leaks a stored value' if leak(r).startswith('LEAK') else 'no stored value')]+=1
print('admitted, then the stream ends in an error:',len(err))
for k,v in sorted(cc.items()): print('  ',k[0],'/',k[1],':',v)
ib=[r for r in adm if any(c['to']=='BOOLEAN' and c['kind']=='column' and c['from']!='VARCHAR' for c in r['casts'])]
print('admitted with a numeric->BOOLEAN column cast:',len(ib),'; of which run without error:',sum(1 for r in ib if r['exec'].startswith('OK')))
rr=[r for r in adm if r['exec'].startswith('OK') and any(c['kind']=='column' and c['from']!='VARCHAR' and num(colcast[(c['child'],c['from'],c['to'])]['rounds'])!='0' for c in r['casts'])]
print('admitted, run without error, a column-side cast rounds a stored witness:',len(rr))
dis=[r for r in cs if (r['plan_error'] is None) and r['stage3_today'].startswith('REJECTED')]
print('binder binds but the stage-3 replica refuses:',len(dis),[r['predicate'] for r in dis])
dis2=[r for r in cs if (r['plan_error'] is not None) and r['stage3_today']=='ADMITTED']
print('binder refuses but the stage-3 replica admits:',len(dis2))
