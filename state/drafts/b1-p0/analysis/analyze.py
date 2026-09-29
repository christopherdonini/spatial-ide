import json, collections, re, sys
rows=[json.loads(l) for l in open('p0.jsonl',encoding='utf-8')]
cases=[r for r in rows if 'family' in r]
colcast={(r['column'],r['from'],r['to']):r['check'] for r in rows if r.get('meta')=='column_cast'}
litcast={(r['label'],r['to']):r for r in rows if r.get('meta')=='literal_cast'}
stored={r['column']:[v for v in r['value'] if v is not None] for r in rows if r.get('meta')=='stored'}
COLS=['zone','flag','i8','i16','i32','i64','u8','u16','u32','u64','f32','f64']
TY=dict(zone='VARCHAR',flag='BOOLEAN',i8='TINYINT',i16='SMALLINT',i32='INTEGER',i64='BIGINT',u8='UTINYINT',u16='USMALLINT',u32='UINTEGER',u64='UBIGINT',f32='FLOAT',f64='DOUBLE')
EQ=['cmp =','cmp <>','cmp IS DISTINCT FROM','cmp IS NOT DISTINCT FROM','cmp = reversed','in']
ORD=['cmp <','cmp <=','cmp >','cmp >=','between']
def num(s):
    m=re.search(r'Int\((\-?\d+)\)|BigInt\((\-?\d+)\)|HugeInt\((\-?\d+)\)|Boolean\((\w+)\)',s)
    if not m: return s
    return next(g for g in m.groups() if g is not None)
def castcls(c, r):
    if c['kind']=='column':
        ch=colcast.get((c['child'],c['from'],c['to']))
        f=num(ch['fails']); rd=num(ch['rounds'])
        tag='col %s->%s'%(c['from'],c['to'])
        if f not in ('0',): tag+=' FAILS'
        if rd not in ('0',): tag+=' ROUNDS'
        if f=='0' and rd=='0': tag+=' ok'
        return tag
    if c['kind']=='constant':
        return 'lit %s->%s'%(c['from'],c['to'])
    return '%s %s->%s'%(c['kind'],c['from'],c['to'])
def leak(r):
    e=r['exec']
    if not e.startswith('EXEC_ERR'): return ''
    msg=e.split('\n')[0]
    if 'Binder Error' in msg: return 'binder'
    hits=[]
    for col in COLS:
        for v in stored[col]:
            if len(v)>=2 and v not in r['predicate'] and re.search(r"(?<![\w.])"+re.escape(v)+r"(?![\w.])",msg):
                hits.append(v)
    return 'LEAK:'+','.join(sorted(set(hits))) if hits else 'err-no-file-value'
def cell(col,op,fams):
    sigs=collections.OrderedDict()
    for f in fams:
        rs=[r for r in cases if r['family']==f and r['column']==col and r['operand']==op]
        if not rs: continue
        r=rs[0]
        if r['plan_error']:
            s='BINDER-REFUSES'
        else:
            s='; '.join(sorted(set(castcls(c,r) for c in r['casts']))) or 'no cast'
        s+=' | today:'+('adm' if r['stage3_today']=='ADMITTED' else r['stage3_today'].split(':')[0])
        s+=' | exec:'+('ok' if r['exec'].startswith('OK') else leak(r))
        sigs.setdefault(s,[]).append(f)
    return sigs
if __name__=='__main__':
    ops=[r['operand'] for r in cases if r['column']=='zone' and r['family']=='cmp =']
    for col in COLS:
        print('=== column',col,TY[col])
        for op in ops:
            e=cell(col,op,EQ); o=cell(col,op,ORD)
            def fmt(d):
                if len(d)==1: return list(d)[0]
                return ' || '.join('%s [%s]'%(k,','.join(v)) for k,v in d.items())
            print('  %-14s EQ: %s\n  %-14s ORD: %s'%(op,fmt(e),'',fmt(o)))
