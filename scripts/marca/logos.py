# Genera los logos SVG de la marca Ensamble (símbolo + "chymera" en Bricolage Grotesque 800, en curvas).
# Uso: python3 scripts/marca/logos.py  (necesita fonttools y uharfbuzz)
import io, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FUENTE = RAIZ / 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2'
SALIDA = RAIZ / 'public/brand'
MEDIANOCHE, PAPEL, MAIZ = '#14213D', '#F5F5F0', '#FCC931'

f = instantiateVariableFont(TTFont(FUENTE), {'opsz': 96, 'wght': 800, 'wdth': 100})
f.flavor = None
buf = io.BytesIO(); f.save(buf); data = buf.getvalue()
upem = f['head'].unitsPerEm
gs = f.getGlyphSet()

def palabra(texto, tracking=-0.05):
    face = hb.Face(data); font = hb.Font(face)
    b = hb.Buffer(); b.add_str(texto); b.guess_segment_properties(); hb.shape(font, b, {'kern': True})
    names = f.getGlyphOrder(); x = 0; pen = SVGPathPen(gs); bp = BoundsPen(gs)
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        g = names[info.codepoint]
        # y hacia abajo: escala (1,-1)
        gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, 0)))
        gs[g].draw(TransformPen(bp, (1, 0, 0, -1, x + pos.x_offset, 0)))
        x += pos.x_advance + tracking * upem
    return pen.getCommands(), bp.bounds  # bounds en y invertida

def simbolo(color, acento, escala=1.0, dx=0.0, dy=0.0):
    t = f'transform="translate({dx:.2f} {dy:.2f}) scale({escala:.5f}) translate(-4 -4)"'
    return (f'<g {t}><path fill="{color}" d="M48 4A44 44 0 0 0 4 48H48Z"/>'
            f'<path fill="{color}" d="M4 52H48V96A44 44 0 0 1 4 52Z"/>'
            f'<path fill="{acento}" d="M52 4H96L52 48Z"/></g>')

def svg(w, h, cuerpo, titulo='Chymera'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w/ (w if w<200 else 20) * (1 if w>=200 else 92):.0f}" height="{h / (w if w<200 else 20) * (1 if w>=200 else 92):.0f}">'
            f'<title>{titulo}</title>{cuerpo}</svg>\n')

d, (x0, y0, x1, y1) = palabra('chymera')
# Altura del símbolo = de la cima de la "h" a la línea base; la palabra baja con la "y".
alto_h = -y0
escala = alto_h / 92
sep = alto_h * 0.30
ancho_s = 92 * escala
for nombre, color in (('medianoche', MEDIANOCHE), ('papel', PAPEL)):
    cuerpo = simbolo(color, MAIZ, escala, 0, 0) + f'<path fill="{color}" transform="translate({ancho_s + sep - x0:.2f} {alto_h:.2f})" d="{d}"/>'
    (SALIDA / f'chymera-logo-{nombre}.svg').write_text(svg(ancho_s + sep + (x1 - x0), alto_h + y1, cuerpo))
    (SALIDA / f'chymera-simbolo-{nombre}.svg').write_text(svg(92, 92, simbolo(color, MAIZ)))
    (SALIDA / f'chymera-palabra-{nombre}.svg').write_text(svg(x1 - x0, y1 - y0, f'<path fill="{color}" transform="translate({-x0:.2f} {-y0:.2f})" d="{d}"/>'))
print('ok', alto_h, x1 - x0)
