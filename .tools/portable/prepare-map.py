import json, math, html
from pathlib import Path
root=Path(__file__).resolve().parents[2]
out=root/'public/offline'
W=3200
west,east,south,north=23,55,42,63
merc=lambda lat: math.log(math.tan(math.pi/4+math.radians(max(-85,min(85,lat)))/2))
scale=W/math.radians(east-west)
H=round((merc(north)-merc(south))*scale)
def xy(c): return (math.radians(c[0]-west)*scale,(merc(north)-merc(c[1]))*scale)
def path(coords,close=False): return 'M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in map(xy,coords))+('Z' if close else '')
def visible(coords): return any(west-1<=c[0]<=east+1 and south-1<=c[1]<=north+1 for c in coords)
def features(p): return json.loads(p.read_bytes())['features']
parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#cbdfe8"/><g stroke-linejoin="round" stroke-linecap="round">']
for f in features(out/'countries.geojson'):
 g=f['geometry']; polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
 for rings in polys:
  if visible(rings[0]): parts.append('<path d="'+' '.join(path(r,True) for r in rings)+'" fill="#f3f1e9" stroke="#b6beb9" stroke-width="2" fill-rule="evenodd"/>')
for filename,stroke,width in [('boundaries.geojson','#d3d5cd',1.3),('rivers.geojson','#b9d8e6',2.2)]:
 for f in features(out/filename):
  g=f['geometry']; lines=g['coordinates'] if g['type']=='MultiLineString' else [g['coordinates']]
  for line in lines:
   if len(line)>1 and visible(line):parts.append(f'<path d="{path(line)}" fill="none" stroke="{stroke}" stroke-width="{width}"/>')
roads_count=0
for f in features(root/'.artifacts/portable-cache/ne_10m_roads.geojson'):
 g=f['geometry'];lines=g['coordinates'] if g['type']=='MultiLineString' else [g['coordinates']]
 for line in lines:
  if len(line)>1 and visible(line):
   roads_count+=1
   d=path(line)
   parts.append(f'<path d="{d}" fill="none" stroke="#dfcf9b" stroke-width="3.2"/><path d="{d}" fill="none" stroke="#fffaf0" stroke-width="1.7"/>')
cities=[('Москва',37.6173,55.7558,1),('Ростов-на-Дону',39.7015,47.2357,1),('Воронеж',39.2089,51.6755,1),('Тула',37.6173,54.1931,0),('Липецк',39.5947,52.6103,0),('Елец',38.5017,52.6237,0),('Новочеркасск',40.0939,47.422,0),('Шахты',40.2144,47.7096,0),('Миллерово',40.3967,48.9226,0),('Богучар',40.55,49.9358,0),('Павловск',40.1,50.46,0),('Новомосковск',38.29,54.01,0),('Серпухов',37.41,54.92,0),('Рязань',39.71,54.63,0),('Калуга',36.26,54.51,0),('Курск',36.19,51.73,0),('Белгород',36.59,50.6,0),('Волгоград',44.51,48.71,1),('Саратов',46.03,51.53,0),('Тамбов',41.45,52.72,0),('Смоленск',32.05,54.78,0),('Тверь',35.91,56.86,0),('Ярославль',39.88,57.63,0),('Нижний Новгород',44,56.33,0),('Санкт-Петербург',30.34,59.93,1),('Краснодар',38.98,45.04,1),('Ставрополь',41.97,45.04,0),('Астрахань',48.04,46.35,0),('Брянск',34.37,53.24,0),('Орёл',36.06,52.97,0)]
parts.append('</g><g font-family="Arial,sans-serif" fill="#646b66" stroke="#f3f1e9" stroke-width="5" paint-order="stroke" stroke-linejoin="round">')
for name,lon,lat,major in cities:
 x,y=xy([lon,lat]);size=27 if major else 22
 parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#8c938d" stroke-width="2"/><text x="{x+10:.1f}" y="{y-8:.1f}" font-size="{size}" font-weight="{600 if major else 400}">{html.escape(name)}</text>')
parts.append('</g></svg>')
(out/'route-map.svg').write_text(''.join(parts),encoding='utf-8')
(out/'SOURCES.txt').write_text('Offline map: Natural Earth, public domain. https://www.naturalearthdata.com/about/terms-of-use/\nSaved route: OSRM / OpenStreetMap contributors, ODbL. https://www.openstreetmap.org/copyright\nLeaflet 1.9.4, BSD-2-Clause. leaflet-LICENSE.txt\nLeaflet.markercluster 1.5.3, MIT. markercluster-LICENSE.txt\nMontserrat, SIL Open Font License 1.1. montserrat-OFL.txt\nNode.js v24.18.0, node-LICENSE.txt\n',encoding='utf-8')
print({'map_pixels':[W,H],'roads':roads_count,'svg_bytes':(out/'route-map.svg').stat().st_size})
