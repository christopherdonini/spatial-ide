from analyze import *
def code(col,op,fams):
    outs=set()
    for f in fams:
        rs=[r for r in cases if r['family']==f and r['column']==col and r['operand']==op]
        if not rs: continue
        r=rs[0]
        if r['plan_error']: outs.add('B'); continue
        s=''
        kinds=set()
        for c in r['casts']:
            if c['kind']=='column':
                ch=colcast[(c['child'],c['from'],c['to'])]
                fl=num(ch['fails'])!='0'; rd=num(ch['rounds'])!='0'
                kinds.add('F' if fl else ('R' if rd else 'W'))
            elif c['kind']=='constant':
                if c['from']=='NULL': kinds.add('n')
                else: kinds.add('L')
            else: kinds.add('?')
        s=''.join(sorted(kinds)) or '.'
        e=r['exec']
        if e.startswith('EXEC_ERR'):
            lk=leak(r)
            s+= '$' if lk.startswith('LEAK') else '!'
        if r['stage3_today']!='ADMITTED': s+='(s3:'+r['stage3_today'][:12]+')'
        outs.add(s)
    return '/'.join(sorted(outs))
ops=[r['operand'] for r in cases if r['column']=='zone' and r['family']=='cmp =']
short={o:o.replace('lit:','').replace('col:','') for o in ops}
import sys
grp=sys.argv[1]
fams={'EQ':EQ,'ORD':ORD,'ADD':['arith + then > 0'],'MUL':['arith * then > 0'],'SUB':['arith - then > 0'],'DIV':['arith / then > 0']}[grp]
print('%-10s'%grp+' '.join('%-5s'%c for c in COLS))
for op in ops:
    print('%-10s'%short[op][:10]+' '.join('%-5s'%code(c,op,fams) for c in COLS))
