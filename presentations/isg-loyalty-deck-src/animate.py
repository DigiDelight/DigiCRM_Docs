"""Add slide transitions + auto-playing entrance animations to a pptxgenjs deck.

Shapes named  A<group><effect>|label  animate in group order on slide load
(effect: f=fade, r=rise, w=wipe from left, z=zoom). Usage: animate.py in.pptx out.pptx
"""
import re
import sys
import zipfile

STEP_MS = 280  # gap between groups

def effect(ids, spid, kind, delay, first, sp):
    ctn = lambda: next(ids)
    vis = (f'<p:set><p:cBhvr><p:cTn id="{ctn()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
           f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
           '<p:to><p:strVal val="visible"/></p:to></p:set>')
    def fade(dur, flt='fade'):
        return (f'<p:animEffect transition="in" filter="{flt}"><p:cBhvr><p:cTn id="{ctn()}" dur="{dur}"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>')
    def anim(attr, v0, v1, dur):
        return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{ctn()}" dur="{dur}" fill="hold"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:tavLst><p:tav tm="0"><p:val><p:strVal val="{v0}"/></p:val></p:tav>'
                f'<p:tav tm="100000"><p:val><p:strVal val="{v1}"/></p:val></p:tav></p:tavLst></p:anim>')
    preset = {'f': (10, 0), 'r': (42, 0), 'w': (22, 8), 'z': (53, 16)}[kind]
    outer = ctn()
    body = vis
    if kind == 'f':
        body += fade(500)
    elif kind == 'r':
        body += fade(600) + anim('ppt_x', '#ppt_x', '#ppt_x', 600) + anim('ppt_y', '#ppt_y+.05', '#ppt_y', 600)
    elif kind == 'w':
        body += fade(550, 'wipe(left)')
    else:
        body += anim('ppt_w', '0', '#ppt_w', 500) + anim('ppt_h', '0', '#ppt_h', 500) + fade(500)
    grp = ' grpId="0"' if sp else ''
    node = 'afterEffect' if first else 'withEffect'
    return (f'<p:par><p:cTn id="{outer}" presetID="{preset[0]}" presetClass="entr" presetSubtype="{preset[1]}" fill="hold"{grp} nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{body}</p:childTnLst></p:cTn></p:par>')


def add_motion(xml, slide_no):
    targets = re.findall(r'<p:(nvSpPr|nvPicPr)><p:cNvPr id="(\d+)" name="A(\d+)([frwz])\|', xml)
    trans = '<p:transition spd="slow"><p:push dir="u"/></p:transition>' if slide_no in (1,) else '<p:transition spd="med"><p:fade/></p:transition>'
    timing = ''
    if targets:
        counter = iter(range(5, 100000))
        targets.sort(key=lambda t: int(t[2]))
        groups = sorted({int(t[2]) for t in targets})
        rank = {g: i for i, g in enumerate(groups)}
        effects = ''.join(
            effect(counter, spid, kind, rank[int(g)] * STEP_MS, i == 0, tag == 'nvSpPr')
            for i, (tag, spid, g, kind) in enumerate(targets))
        bld = ''.join(f'<p:bldP spid="{spid}" grpId="0" animBg="1"/>' for tag, spid, _, _ in targets if tag == 'nvSpPr')
        timing = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
                  '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
                  '<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>'
                  '<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                  f'{effects}'
                  '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>'
                  '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
                  '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
                  '</p:childTnLst></p:cTn></p:par></p:tnLst>'
                  + (f'<p:bldLst>{bld}</p:bldLst>' if bld else '') + '</p:timing>')
    assert '<p:transition' not in xml and '<p:timing' not in xml
    return xml.replace('</p:sld>', trans + timing + '</p:sld>'), len(targets)


def main(src, dst):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            m = re.fullmatch(r'ppt/slides/slide(\d+)\.xml', item.filename)
            if m:
                xml, n = add_motion(data.decode('utf-8'), int(m.group(1)))
                print(f'slide {m.group(1)}: {n} animated shapes')
                data = xml.encode('utf-8')
            zout.writestr(item, data)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
