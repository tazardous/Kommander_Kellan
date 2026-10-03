"""Play-test bot: tries jump timings at every pit, wall, door and lift, then runs
the whole game start to finish and the boss fight. Needs: pip install playwright
and python -m playwright install chromium (or set CHROME to a Chromium path).

Run: python tests/run.py
"""
import asyncio, json, os, pathlib
HERE=os.path.dirname(os.path.abspath(__file__))
GAME=pathlib.Path(HERE).parent.joinpath('index.html').resolve().as_uri()
from playwright.async_api import async_playwright
T=[
 # name, level, start tiles, start row(standing on row ty means feet at (ty+1)*16), condition, options
 ('L1 goo 21-22',0,[17,18,19],11,'P.x>23.5*16',{}),
 ('L1 pogo wall',0,[41,42,43],11,'P.x>48.2*16',{}),
 ('L1 wall needs pogo (expect FAIL)',0,[41,42,43],11,'P.x>48.2*16',{'pogo':False}),
 ('L1 goo 61-63',0,[57,58,59],11,'P.x>64.2*16',{}),
 ('L1 yellow gem',0,[63,64,65,66],11,"K.keys()['1']",{}),
 ('L1 yellow door',0,[77,78],11,'P.x>81.5*16',{'keys':{'1':True}}),
 ('L1 door locked (expect FAIL)',0,[77,78],11,'P.x>81.5*16',{'pogo':False}),
 ('L1 goo 101-103',0,[97,98,99],11,'P.x>104.2*16',{}),
 ('L1 wheel',0,[107,108],11,'K.partGot',{}),
 ('L1 exit',0,[118,119],11,"K.state==='levelEnd'",{}),
 ('L2 lift 19-24',1,[16,17,18],11,'P.x>25.2*16',{'waits':[0,30,60,90,120,150,180,210]}),
 ('L2 red gem',1,[25,26],11,"K.keys()['2']",{}),
 ('L2 red door',1,[38,39],11,'P.x>42.2*16',{'keys':{'2':True}}),
 ('L2 gap 63-64 up',1,[59,60,61],11,'P.x>65.2*16&&P.y<10*16',{}),
 ('L2 blue gem pillar',1,[72,73,74],9,"K.keys()['3']",{}),
 ('L2 blue door',1,[94,95],11,'P.x>98.2*16',{'keys':{'3':True}}),
 ('L2 lift 111-118',1,[107,108,109],11,'P.x>119.2*16',{'waits':[0,30,60,90,120,150,180,210,240,270]}),
 ('L2 battery',1,[124,125],11,'K.partGot',{}),
 ('L2 exit',1,[130,131],11,"K.state==='levelEnd'",{}),
 ('L3 cliffs',2,[12,13,14],11,'P.x>27*16',{}),
 ('L3 lava 31-34',2,[28,29],8,'P.x>35.2*16',{}),
 ('L3 big wall',2,[52,53,54],11,'P.x>61.2*16',{}),
 ('L3 green gem',2,[66,67,68,69],11,"K.keys()['4']",{}),
 ('L3 lava 81-83',2,[77,78,79],11,'P.x>84.2*16',{}),
 ('L3 green door',2,[98,99],11,'P.x>102.2*16',{'keys':{'4':True}}),
 ('L3 stepping stones',2,[104,105,106],11,'P.x>122.2*16',{}),
 ('L3 fuel',2,[128,129],11,'K.partGot',{}),
 ('L4 fence 24',3,[20,21,22],11,'P.x>25.2*16&&P.hearts===99',{}),
 ('L4 lift 46-52',3,[42,43,44],11,'P.x>53.2*16',{'waits':[0,30,60,90,120,150,180,210,240]}),
 ('L4 fence 76-78',3,[72,73,74],11,'P.x>79.2*16&&P.hearts===99',{}),
 ('L4 elevator ledge',3,[86,87],11,'P.x>90*16&&P.y+P.h<=5*16+1',{'waits':[0,30,60,90,120,150,180,210,240,270,300],'rights':[0,8,16,24,400],'jumpAts':[0,20,60,100,140,180,220]}),
 ('L4 exit',3,[118,119],11,"K.state==='levelEnd'",{}),
 ('L5 lava 18-20',4,[14,15,16],11,'P.x>21.2*16',{}),
 ('L5 ledge ammo',4,[24,25],11,'K.ammo>=8',{}),
 ('L5 lift 41-48',4,[37,38,39],11,'P.x>49.2*16',{'waits':[0,30,60,90,120,150,180,210,240,270]}),
]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=os.environ.get('CHROME') or None)
        pg=await b.new_page(viewport={'width':960,'height':600})
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto(GAME); await pg.wait_for_timeout(500)
        await pg.add_script_tag(path=os.path.join(HERE,'harness.js'))
        for name,lv,starts,ty,cond,opt in T:
            r=await pg.evaluate('([n,l,s,ty,c,o])=>tryReach(n,l,s,ty,c,o)',[name,lv,starts,ty,cond,opt])
            print(('PASS ' if r['ok'] else 'FAIL ')+name, r.get('how',''), 'tries',r['tries'])
        for f in ('flow.js','boss.js'):
            await pg.goto(GAME); await pg.wait_for_timeout(400)
            print(f, json.dumps(await pg.evaluate(open(os.path.join(HERE,f)).read())))
        print('errors:',errs)
        await b.close()
asyncio.run(main())
