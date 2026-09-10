import {CONTENT} from './content.js';
import {add,sub,mul,dot,cross,len,dist,unit,perp,mid,rotate,project,near,circumcenter,incenter,regular,segment as L,circle as C,polygon,hasLine,hasCircle,hasPolygon,allPoints,EPS} from './geometry.js';
const p=(x,y)=>({x,y}), A=p(370,410), B=p(620,410), O=p(530,360), R=p(530,185), T=[p(380,450),p(680,450),p(475,220)], Q=[p(390,470),p(670,470),p(670,290),p(390,290)], anglePoints=[p(740,470),p(840,470),p(790,383.3974596215561)];
const area=ps=>Math.abs(ps.reduce((a,b,i)=>a+cross(b,ps[(i+1)%ps.length]),0))/2;
const angle=(a,b,c)=>Math.acos(Math.max(-1,Math.min(1,dot(unit(sub(a,b)),unit(sub(c,b))))));
const triangleOn=(a,b,r1,r2,sign=-1)=>{const d=dist(a,b),x=(r1*r1-r2*r2+d*d)/(2*d),h=Math.sqrt(Math.max(0,r1*r1-x*x)),u=unit(sub(b,a));return add(add(a,mul(u,x)),mul(perp(u),sign*h));};
const square=(a,b,s=-1)=>[a,b,add(b,mul(perp(sub(b,a)),s)),add(a,mul(perp(sub(b,a)),s))];
const para=(a,b,S,theta,s=-1)=>{const h=S/dist(a,b),v=add(mul(unit(sub(b,a)),h/Math.tan(theta)),mul(perp(unit(sub(b,a))),s*h));return[a,b,add(b,v),add(a,v)];};
const transform=(ps,a,b)=>{const u=sub(ps[1],ps[0]),v=sub(b,a),t=Math.atan2(v.y,v.x)-Math.atan2(u.y,u.x),k=len(v)/len(u);return ps.map(x=>add(a,mul(rotate(sub(x,ps[0]),t),k)));};
const sideLengths=ps=>ps.map((v,i)=>dist(v,ps[(i+1)%ps.length]));
function similar(a,b){const x=sideLengths(a).sort((a,b)=>a-b),y=sideLengths(b).sort((a,b)=>a-b);return x.every((v,i)=>Math.abs(v/x[0]-y[i]/y[0])<.00015);}
const circleInputs=['Center','Point on the circle'];
const specs={
'I.1':{pts:[A,B],labels:['A','B'],edges:[[0,1]],inputs:['First endpoint','Second endpoint'],tool:'Equilateral triangle',description:'On the given line AB, construct a triangle with three equal sides.',kind:'triangleBase',out:([a,b],s)=>polygon([a,b,triangleOn(a,b,dist(a,b),dist(a,b),s)])},
'I.2':{pts:[p(410,330),p(620,450),p(800,450)],labels:['A','B','C'],edges:[[1,2]],inputs:['New starting point','Length start','Length end'],tool:'Transfer length',description:'From A, draw a segment equal in length to BC. Any direction is valid.',kind:'lengthAnchor',out:([a,b,c])=>[L(a,add(a,mul(unit(p(1,-.45)),dist(b,c))))]},
'I.3':{pts:[p(330,330),p(730,330),p(460,490),p(650,490)],labels:['A','B','C','D'],edges:[[0,1],[2,3]],inputs:['Long segment start','Long segment end','Short segment start','Short segment end'],tool:'Cut off a length',description:'Find E on AB so that AE equals the shorter segment CD.',kind:'point',out:([a,b,c,d])=>[L(a,add(a,mul(unit(sub(b,a)),dist(c,d))))]},
'I.9':{pts:[p(410,455),p(735,455),p(610,220)],labels:['A','B','C'],edges:[[0,1],[0,2]],inputs:['Angle vertex','First ray point','Second ray point'],tool:'Angle bisector',description:'Draw a line from A that divides angle BAC into two equal angles.',kind:'direction',out:([a,b,c])=>[L(a,add(a,mul(unit(add(unit(sub(b,a)),unit(sub(c,a)))),260)))]},
'I.10':{pts:[A,B],labels:['A','B'],edges:[[0,1]],inputs:['First endpoint','Second endpoint'],tool:'Midpoint',description:'Construct the midpoint of AB. An intersection at the midpoint is enough.',kind:'point',out:([a,b])=>[],point:([a,b])=>mid(a,b)},
'I.11':{pts:[p(310,420),p(780,420),p(545,420)],labels:['A','B','C'],edges:[[0,1]],inputs:['Line start','Line end','Point on line'],tool:'Raise perpendicular',description:'Construct a perpendicular to AB through the given point C.',kind:'direction',out:([a,b,c],s)=>[L(c,add(c,mul(perp(unit(sub(b,a))),230*s)))]},
'I.12':{pts:[p(320,470),p(790,470),p(555,240)],labels:['A','B','P'],edges:[[0,1]],inputs:['Line start','Line end','External point'],tool:'Drop perpendicular',description:'Join P to AB with a perpendicular line.',kind:'direction',out:([a,b,c])=>[L(c,project(c,a,b))]},
'I.22':{pts:[p(330,440),p(600,440),p(660,305),p(860,305),p(660,520),p(900,520)],labels:['A','B','C','D','E','F'],edges:[[0,1],[2,3],[4,5]],inputs:['Base start','Base end','Second length start','Second length end','Third length start','Third length end'],tool:'Three-side triangle',description:'Build a triangle with side lengths AB, CD, and EF. You may use AB as its base.',kind:'triangleLengths',out:([a,b,c,d,e,f],s)=>polygon([a,b,triangleOn(a,b,dist(c,d),dist(e,f),s)])},
'I.23':{pts:[p(370,430),p(660,430),p(725,265),p(805,265),p(765,190)],labels:['A','B','C','D','E'],edges:[[0,1],[2,3],[2,4]],inputs:['New vertex','Point on new ray','Source vertex','Source first ray','Source second ray'],tool:'Copy angle',description:'At A, construct an angle with AB equal to the given angle DCE.',kind:'copyAngle',out:([a,b,c,d,e],s)=>[L(a,add(a,mul(rotate(unit(sub(b,a)),s*angle(d,c,e)),220)))]},
'I.31':{pts:[p(340,490),p(740,425),p(500,245)],labels:['A','B','P'],edges:[[0,1]],inputs:['Line start','Line end','Point for parallel'],tool:'Parallel line',description:'Through P, draw a line parallel to AB.',kind:'direction',out:([a,b,c])=>[L(c,add(c,mul(unit(sub(b,a)),270)))]},
'I.42':{pts:[...T,...anglePoints],labels:['A','B','C','D','E','F'],edges:[[0,1],[1,2],[2,0],[4,3],[4,5]],inputs:['Triangle first vertex','Triangle second vertex','Triangle third vertex','Angle first ray','Angle vertex','Angle second ray'],tool:'Triangle to parallelogram',description:'Construct a parallelogram equal in area to triangle ABC, with an interior angle equal to DEF.',kind:'areaPara',out:(ps,s)=>polygon(para(mid(ps[0],ps[1]),ps[1],area(ps.slice(0,3)),angle(...ps.slice(3,6)),s))},
'I.44':{pts:[p(360,510),p(640,510),p(660,370),p(870,370),p(735,200),p(330,260),p(430,260),p(380,173.3974596)],labels:['A','B','C','D','E','F','G','H'],edges:[[0,1],[2,3],[3,4],[4,2],[6,5],[6,7]],inputs:['Target base start','Target base end','Triangle first vertex','Triangle second vertex','Triangle third vertex','Angle first ray','Angle vertex','Angle second ray'],tool:'Apply area to a base',description:'On AB, construct a parallelogram equal in area to CDE, with angle FGH.',kind:'areaPara',out:(ps,s)=>polygon(para(ps[0],ps[1],area(ps.slice(2,5)),angle(...ps.slice(5,8)),s))},
'I.45':{pts:[p(370,455),p(620,455),p(650,270),p(440,240),...anglePoints],labels:['A','B','C','D','E','F','G'],edges:[[0,1],[1,2],[2,3],[3,0],[5,4],[5,6]],inputs:['Quadrilateral vertex 1','Quadrilateral vertex 2','Quadrilateral vertex 3','Quadrilateral vertex 4','Angle first ray','Angle vertex','Angle second ray'],tool:'Quadrilateral to parallelogram',description:'Construct a parallelogram with the area of ABCD and an interior angle equal to EFG.',kind:'areaPara',out:(ps,s)=>polygon(para(ps[0],ps[1],area(ps.slice(0,4)),angle(...ps.slice(4,7)),s))},
'I.46':{pts:[p(370,490),p(620,490)],labels:['A','B'],edges:[[0,1]],inputs:['Base start','Base end'],tool:'Square',description:'Construct a square with AB as one of its sides.',kind:'squareBase',out:([a,b],s)=>polygon(square(a,b,s))},
'II.11':{pts:[p(350,420),p(730,420)],labels:['A','B'],edges:[[0,1]],inputs:['First endpoint','Second endpoint'],tool:'Golden section',description:'Find C on AB so that AB × CB = AC². AC will be the longer part.',kind:'point',out:()=>[],point:([a,b])=>add(a,mul(sub(b,a),(Math.sqrt(5)-1)/2))},
'II.14':{pts:Q,labels:['A','B','C','D'],edges:[[0,1],[1,2],[2,3],[3,0]],inputs:['Quadrilateral vertex 1','Quadrilateral vertex 2','Quadrilateral vertex 3','Quadrilateral vertex 4'],tool:'Square a quadrilateral’s area',description:'Construct a square equal in area to the given rectangle ABCD.',kind:'areaSquare',out:(ps,s)=>polygon(square(ps[0],add(ps[0],mul(unit(sub(ps[1],ps[0])),Math.sqrt(area(ps)))),s))},
'III.1':{pts:[p(350,365),p(570,196),p(691,440)],labels:['A','B','C'],inputs:['First point on circle','Second point on circle','Third point on circle'],tool:'Circle center',description:'Find the hidden center of the circle. Constructed intersections count as points.',kind:'point',special:'hiddenCircle',out:()=>[],point:ps=>circumcenter(...ps)},
'III.17':{pts:[p(465,375),p(465,225),p(780,395)],labels:['O','A','P'],inputs:['Circle center','Point on circle','External point'],tool:'Tangents',description:'From P, draw a tangent to the circle. Either point of tangency is valid.',kind:'tangent',special:'circle',out:([o,a,q],s)=>{const r=dist(o,a),d=dist(o,q),u=unit(sub(q,o)),x=r*r/d,h=Math.sqrt(Math.max(0,r*r-x*x)),t=add(o,add(mul(u,x),mul(perp(u),s*h)));return[L(q,t)];}},
'III.25':{pts:[p(335,385),p(455,210),p(680,320)],labels:['A','B','C'],inputs:['First arc point','Second arc point','Third arc point'],tool:'Circle through three points',description:'Complete the circle of which the highlighted arc is a part.',kind:'circle',special:'arc',out:ps=>{const c=circumcenter(...ps);return[C(c,dist(c,ps[0]))];}},
'III.30':{pts:[p(355,400),p(690,365)],labels:['A','B'],inputs:['Circle center','First arc endpoint','Second arc endpoint'],tool:'Minor arc midpoint',description:'Bisect the highlighted upper arc AB. Construct its midpoint on the arc.',kind:'point',special:'bisectArc',out:()=>[],point:ps=>add(ps[0],mul(unit(add(unit(sub(ps[1],ps[0])),unit(sub(ps[2],ps[0])))),dist(ps[0],ps[1])))},
'III.33':{pts:[p(360,445),p(680,445),...anglePoints],labels:['A','B','C','D','E'],edges:[[0,1],[3,2],[3,4]],inputs:['Chord start','Chord end','Angle first ray','Angle vertex','Angle second ray'],tool:'Circle from chord and angle',description:'Draw a circle through A and B, then mark X on an arc so that angle AXB equals CDE.',kind:'angleCircle',out:([a,b,c,d,e],s)=>{const th=angle(c,d,e),o=add(mid(a,b),mul(perp(unit(sub(b,a))),s*dist(a,b)/(2*Math.tan(th))));return[C(o,dist(o,a))];}},
'III.34':{pts:[O,R,...anglePoints],labels:['O','A','B','C','D'],edges:[[3,2],[3,4]],inputs:['Circle center','Point on circle','Angle first ray','Angle vertex','Angle second ray'],tool:'Chord from inscribed angle',description:'Draw a chord from A and mark X on the other arc, so that the chord subtends angle BCD at X.',kind:'angleChord',special:'circle',out:([o,a,b,c,d],s)=>[L(a,add(o,rotate(sub(a,o),2*s*angle(b,c,d))))]},
'IV.1':{pts:[O,R,p(750,425),p(920,425)],labels:['O','A','B','C'],edges:[[2,3]],inputs:['Circle center','Point on circle','Length start','Length end'],tool:'Fit a chord',description:'In the circle, construct a chord equal to BC.',kind:'chord',special:'circle',out:([o,a,b,c],s)=>[L(a,add(o,rotate(sub(a,o),s*2*Math.asin(dist(b,c)/(2*dist(o,a))))))]},
'IV.2':{pts:[p(495,365),p(495,185),p(755,435),p(900,435),p(790,270)],labels:['O','A','B','C','D'],edges:[[2,3],[3,4],[4,2]],inputs:['Circle center','Point on circle','Source triangle vertex 1','Source triangle vertex 2','Source triangle vertex 3'],tool:'Inscribe similar triangle',description:'Inscribe a triangle in the circle that is similar to triangle BCD.',kind:'similarIn',special:'circle',out:([o,a,...t])=>{const cc=circumcenter(...t),k=dist(o,a)/dist(cc,t[0]),th=Math.atan2(a.y-o.y,a.x-o.x)-Math.atan2(t[0].y-cc.y,t[0].x-cc.x);return polygon(t.map(x=>add(o,mul(rotate(sub(x,cc),th),k))));}},
'IV.3':{pts:[p(495,365),p(495,255),p(755,435),p(900,435),p(790,270)],labels:['O','A','B','C','D'],edges:[[2,3],[3,4],[4,2]],inputs:['Circle center','Point on circle','Source triangle vertex 1','Source triangle vertex 2','Source triangle vertex 3'],tool:'Circumscribe similar triangle',description:'Around the circle, construct a triangle similar to BCD, with all three sides tangent.',kind:'similarOut',special:'circle',out:([o,a,...t])=>{const cc=incenter(...t),k=dist(o,a)/dist(cc,project(cc,t[0],t[1]));return polygon(t.map(x=>add(o,mul(sub(x,cc),k))));}},
'IV.4':{pts:T,labels:['A','B','C'],edges:[[0,1],[1,2],[2,0]],inputs:['Triangle vertex 1','Triangle vertex 2','Triangle vertex 3'],tool:'Triangle incircle',description:'Construct a circle inside ABC that touches all three sides.',kind:'circle',out:ps=>{const o=incenter(...ps);return[C(o,dist(o,project(o,ps[0],ps[1])))];}},
'IV.5':{pts:T,labels:['A','B','C'],edges:[[0,1],[1,2],[2,0]],inputs:['Triangle vertex 1','Triangle vertex 2','Triangle vertex 3'],tool:'Triangle circumcircle',description:'Construct a circle through all three vertices of triangle ABC.',kind:'circle',out:ps=>{const o=circumcenter(...ps);return[C(o,dist(o,ps[0]))];}},
'IV.6':{pts:[O,R],labels:['O','A'],inputs:circleInputs,tool:'Inscribe square',description:'Construct a square with all four vertices on the circle.',kind:'regularIn',n:4,special:'circle'},
'IV.7':{pts:[O,p(530,225)],labels:['O','A'],inputs:circleInputs,tool:'Circumscribe square',description:'Construct a square around the circle with all four sides tangent.',kind:'regularOut',n:4,special:'circle'},
'IV.8':{pts:square(p(390,490),p(640,490)),labels:['A','B','C','D'],edges:[[0,1],[1,2],[2,3],[3,0]],inputs:['Square vertex 1','Square vertex 2','Square vertex 3','Square vertex 4'],tool:'Square incircle',description:'Construct the circle inside square ABCD touching all four sides.',kind:'circle',out:ps=>[C(mid(ps[0],ps[2]),dist(ps[0],ps[1])/2)]},
'IV.9':{pts:square(p(390,490),p(640,490)),labels:['A','B','C','D'],edges:[[0,1],[1,2],[2,3],[3,0]],inputs:['Square vertex 1','Square vertex 2','Square vertex 3','Square vertex 4'],tool:'Square circumcircle',description:'Construct the circle through all four vertices of square ABCD.',kind:'circle',out:ps=>{const o=mid(ps[0],ps[2]);return[C(o,dist(o,ps[0]))];}},
'IV.10':{pts:[p(415,470),p(680,470)],labels:['A','B'],edges:[[0,1]],inputs:['Apex','First base vertex'],tool:'Golden triangle',description:'Build an isosceles triangle with AB as an equal side, a 36° angle at A, and 72° base angles.',kind:'goldTriangle',out:([a,b],s)=>polygon([a,b,add(a,rotate(sub(b,a),s*Math.PI/5))])},
'IV.11':{pts:[O,R],labels:['O','A'],inputs:circleInputs,tool:'Inscribe pentagon',description:'Construct a regular pentagon with five vertices on the circle.',kind:'regularIn',n:5,special:'circle'},
'IV.12':{pts:[O,p(530,225)],labels:['O','A'],inputs:circleInputs,tool:'Circumscribe pentagon',description:'Construct a regular pentagon with all five sides tangent to the circle.',kind:'regularOut',n:5,special:'circle'},
'IV.13':{pts:regular(O,190,5),labels:['A','B','C','D','E'],edges:[[0,1],[1,2],[2,3],[3,4],[4,0]],inputs:['Pentagon vertex 1','Pentagon vertex 2','Pentagon vertex 3','Pentagon vertex 4','Pentagon vertex 5'],tool:'Pentagon incircle',description:'Inscribe a circle in the regular pentagon, touching all five sides.',kind:'circle',out:ps=>{const o=circumcenter(...ps.slice(0,3));return[C(o,dist(o,project(o,ps[0],ps[1])))];}},
'IV.14':{pts:regular(O,190,5),labels:['A','B','C','D','E'],edges:[[0,1],[1,2],[2,3],[3,4],[4,0]],inputs:['Pentagon vertex 1','Pentagon vertex 2','Pentagon vertex 3','Pentagon vertex 4','Pentagon vertex 5'],tool:'Pentagon circumcircle',description:'Construct the circle passing through all five pentagon vertices.',kind:'circle',out:ps=>{const o=circumcenter(...ps.slice(0,3));return[C(o,dist(o,ps[0]))];}},
'IV.15':{pts:[O,R],labels:['O','A'],inputs:circleInputs,tool:'Inscribe hexagon',description:'Construct a regular hexagon with six vertices on the circle.',kind:'regularIn',n:6,special:'circle'},
'IV.16':{pts:[O,R],labels:['O','A'],inputs:circleInputs,tool:'Inscribe fifteen-gon',description:'Construct a regular polygon of fifteen sides inside the circle.',kind:'regularIn',n:15,special:'circle'},
'VI.9':{pts:[p(340,415),p(760,415)],labels:['A','B'],edges:[[0,1]],inputs:['Segment start','Segment end'],tool:'Divide into equal parts',description:'Construct P on AB with AP equal to one third of AB.',kind:'point',out:()=>[],point:([a,b],n=3)=>add(a,mul(sub(b,a),1/n))},
'VI.10':{pts:[p(340,350),p(790,350),p(415,505),p(695,505),p(515,505)],labels:['A','B','C','D','E'],edges:[[0,1],[2,3]],inputs:['Target segment start','Target segment end','Source segment start','Source segment end','Source division point'],tool:'Transfer a division',description:'Divide AB at P in the same ratio as CD is divided at E: AP / AB = CE / CD.',kind:'point',out:()=>[],point:([a,b,c,d,e])=>add(a,mul(sub(b,a),dist(c,e)/dist(c,d)))},
'VI.11':{pts:[p(350,330),p(620,330),p(420,470),p(620,470)],labels:['A','B','C','D'],edges:[[0,1],[2,3]],inputs:['First length start','First length end','Second length start','Second length end'],tool:'Third proportional',description:'Construct a segment x such that AB : CD = CD : x.',kind:'length',out:([a,b,c,d])=>[L(c,add(c,mul(perp(unit(sub(d,c))),-(dist(c,d)**2)/dist(a,b))))]},
'VI.12':{pts:[p(350,300),p(630,300),p(410,425),p(630,425),p(440,540),p(600,540)],labels:['A','B','C','D','E','F'],edges:[[0,1],[2,3],[4,5]],inputs:['First length start','First length end','Second length start','Second length end','Third length start','Third length end'],tool:'Fourth proportional',description:'Construct a segment x such that AB : CD = EF : x.',kind:'length',out:([a,b,c,d,e,f])=>[L(e,add(e,mul(perp(unit(sub(f,e))),-dist(c,d)*dist(e,f)/dist(a,b))))]},
'VI.13':{pts:[p(350,330),p(680,330),p(440,485),p(620,485)],labels:['A','B','C','D'],edges:[[0,1],[2,3]],inputs:['First length start','First length end','Second length start','Second length end'],tool:'Geometric mean',description:'Construct a segment x such that x² = AB × CD.',kind:'length',out:([a,b,c,d])=>[L(c,add(c,mul(perp(unit(sub(d,c))),-Math.sqrt(dist(a,b)*dist(c,d)))))]},
'VI.18':{pts:[p(345,525),p(645,525),p(680,350),p(860,350),p(830,210),p(715,170)],labels:['A','B','C','D','E','F'],edges:[[0,1],[2,3],[3,4],[4,5],[5,2]],inputs:['New base start','New base end','Source vertex 1','Source vertex 2','Source vertex 3','Source vertex 4'],tool:'Similar quadrilateral',description:'On AB, construct a quadrilateral similar to CDEF, with AB corresponding to CD.',kind:'similarQuad',out:([a,b,...q],sign=-1)=>{const transformed=transform(q,a,b);return polygon(sign===-1?transformed:transformed.map(x=>sub(mul(project(x,a,b),2),x)));}},
'VI.25':{pts:[p(340,445),p(580,445),p(580,285),p(340,285),p(680,445),p(850,445),p(715,295)],labels:['A','B','C','D','E','F','G'],edges:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,4]],inputs:['Area quadrilateral vertex 1','Area quadrilateral vertex 2','Area quadrilateral vertex 3','Area quadrilateral vertex 4','Shape triangle vertex 1','Shape triangle vertex 2','Shape triangle vertex 3'],tool:'Equal-area similar triangle',description:'Construct a triangle similar to EFG and equal in area to rectangle ABCD.',kind:'similarArea',out:ps=>{const t=ps.slice(4),k=Math.sqrt(area(ps.slice(0,4))/area(t));return polygon(t.map(x=>add(ps[0],mul(sub(x,t[0]),k))));}}
};
for(const [id,s]of Object.entries(specs)){
 s.id=id;s.book=id.split('.')[0];s.number=Number(id.split('.')[1]);Object.assign(s,{source:CONTENT.find(c=>c.id===id)});s.title=s.source.title;s.hints=s.source.hints;s.labels=s.labels||s.pts.map((_,i)=>String.fromCharCode(65+i));
 if(s.kind==='regularIn'||s.kind==='regularOut')s.out=([o,a])=>polygon(regular(o,dist(o,a)/(s.kind==='regularOut'?Math.cos(Math.PI/s.n):1),s.n,Math.atan2(a.y-o.y,a.x-o.x)+(s.kind==='regularOut'?Math.PI/s.n:0)));
 if(s.special==='bisectArc'){
  const o=p(530,415),r=190,a=add(o,mul(p(Math.cos(-2.9),Math.sin(-2.9)),r)),b=add(o,mul(p(Math.cos(-.3),Math.sin(-.3)),r));s.pts=[a,b];s.arc={type:'arc',c:o,r,start:-2.9,end:-.3,hideCenter:true,given:true};s.target=add(o,mul(p(Math.cos(-1.6),Math.sin(-1.6)),r));
 }
}
export const PROPOSITIONS=Object.values(specs);
export function setup(s){let shapes=(s.edges||[]).map(([i,j])=>L(s.pts[i],s.pts[j],{given:true}));let points=s.pts.map((p,i)=>({...p,label:s.labels[i],given:true}));if(s.special==='circle')shapes.push(C(s.pts[0],dist(s.pts[0],s.pts[1]),{given:true}));if(s.special==='hiddenCircle'){let c=circumcenter(...s.pts);shapes.push(C(c,dist(c,s.pts[0]),{given:true,hideCenter:true}));}if(s.special==='arc'){let c=circumcenter(...s.pts),start=Math.atan2(s.pts[0].y-c.y,s.pts[0].x-c.x),end=Math.atan2(s.pts[2].y-c.y,s.pts[2].x-c.x);if(end<start)end+=Math.PI*2;shapes.push({type:'arc',c,r:dist(c,s.pts[0]),start,end,hideCenter:true,given:true});}if(s.arc)shapes.push(s.arc);return{shapes,points};}
export function construct(s,ps,sign=-1,n=3){
 if(ps.length!==s.inputs.length)throw Error('Select every requested point.');
 for(const v of ps)if(!Number.isFinite(v.x)||!Number.isFinite(v.y))throw Error('Choose finite points.');
 const triangleIds=['III.1','III.25','IV.4','IV.5'];
 if(triangleIds.includes(s.id)&&area(ps)<.01)throw Error('Choose three noncollinear points.');
 if(['IV.2','IV.3'].includes(s.id)&&area(ps.slice(2))<.01)throw Error('The source triangle must have three noncollinear vertices.');
 if(['IV.8','IV.9'].includes(s.id)){const center=mid(ps[0],ps[2]),r=dist(center,ps[0]),expected=regular(center,r,4,Math.atan2(ps[0].y-center.y,ps[0].x-center.x));if(![1,-1].some(sign=>ps.every((x,i)=>near(x,expected[(i*sign+4)%4]))))throw Error('Select the four vertices of a square in order.');}
 if(['IV.13','IV.14'].includes(s.id)){const center=circumcenter(...ps.slice(0,3));if(!center)throw Error('Choose a regular pentagon.');const r=dist(center,ps[0]),expected=regular(center,r,5,Math.atan2(ps[0].y-center.y,ps[0].x-center.x));if(![1,-1].some(sign=>ps.every((x,i)=>near(x,expected[(i*sign+5)%5]))))throw Error('Choose the five vertices of a regular pentagon in order.');}
 if(s.id==='III.30'&&len(add(unit(sub(ps[1],ps[0])),unit(sub(ps[2],ps[0]))))<.00001)throw Error('Choose endpoints that do not lie on a diameter.');
 if(s.id==='III.30'&&Math.abs(dist(ps[0],ps[1])-dist(ps[0],ps[2]))>EPS)throw Error('Both arc endpoints must lie on the same circle.');
 if(s.id==='VI.10'&&(Math.abs(cross(sub(ps[4],ps[2]),unit(sub(ps[3],ps[2]))))>EPS||dot(sub(ps[4],ps[2]),sub(ps[4],ps[3]))>EPS))throw Error('The division point must lie on the source segment.');
 let shapes=s.out(ps,sign),points=[];
 if(s.point){const x=s.point(ps,n);if(!x)throw Error('Choose three noncollinear points.');points=[x];}
 if(s.id==='VI.9')points=Array.from({length:n-1},(_,i)=>add(ps[0],mul(sub(ps[1],ps[0]),(i+1)/n)));
 for(const x of shapes)if(x.type==='circle'?(!x.c||!Number.isFinite(x.r)||x.r<.01):(!Number.isFinite(x.a.x)||!Number.isFinite(x.b.x)||dist(x.a,x.b)<.01))throw Error('These points do not define this construction.');
 if(s.id==='I.22'){const lengths=[dist(ps[0],ps[1]),dist(ps[2],ps[3]),dist(ps[4],ps[5])].sort((a,b)=>a-b);if(lengths[0]+lengths[1]<=lengths[2]+.01)throw Error('These lengths cannot form a triangle.');}
 if(s.id==='I.3'&&dist(ps[0],ps[1])<dist(ps[2],ps[3]))throw Error('The first segment must be the longer one.');
 if(s.id==='III.17'&&dist(ps[0],ps[2])<=dist(ps[0],ps[1]))throw Error('Choose a point outside the circle.');
 if(s.id==='IV.1'&&dist(ps[2],ps[3])>2*dist(ps[0],ps[1]))throw Error('The chord must fit within the diameter.');
 if(points.some(x=>!Number.isFinite(x.x)||!Number.isFinite(x.y)))throw Error('These points do not define a finite construction.');
 return{shapes,points};
}
function triangleCandidates(shapes,points){const edges=shapes.filter(x=>x.type==='line');const ps=points.filter(p=>edges.filter(s=>Math.abs(cross(sub(p,s.a),unit(sub(s.b,s.a))))<EPS).length>=2);let out=[];for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){if(!hasLine(edges,ps[i],ps[j]))continue;for(let k=j+1;k<ps.length;k++)if(area([ps[i],ps[j],ps[k]])>1&&hasLine(edges,ps[i],ps[k])&&hasLine(edges,ps[j],ps[k]))out.push([ps[i],ps[j],ps[k]]);}return out;}
export function validate(s,shapes,explicit){
 const drawn=shapes.filter(x=>!x.given),ps=allPoints(shapes,explicit),P=s.pts;
 if(!drawn.length&&!explicit.some(p=>!p.given))return false;
 if(s.kind==='point'){
  let target=s.target||(s.id==='I.3'?s.out(P)[0].b:s.point(P));
  return ps.some(x=>near(x,target)&&!explicit.some(g=>g.given&&near(g,x)));
 }
 if(s.kind==='circle'){const target=s.out(P)[0];return hasCircle(drawn,target.c,target.r);}
 if(s.kind==='length'||s.kind==='lengthAnchor'){const q=s.out(P)[0],r=dist(q.a,q.b);for(const l of drawn.filter(x=>x.type==='line')){const u=unit(sub(l.b,l.a)),starts=s.kind==='lengthAnchor'?[P[0]]:ps.filter(x=>Math.abs(cross(sub(x,l.a),u))<EPS);for(const a of starts)for(const sg of[-1,1]){const b=add(a,mul(u,r*sg));if(ps.some(x=>near(x,b))&&hasLine(shapes,a,b))return true;}}return false;}

 if(s.id==='I.12')return hasLine(drawn,P[2],project(P[2],P[0],P[1]));
 if(s.kind==='direction'){const target=s.out(P,-1)[0],u=unit(sub(target.b,target.a));return drawn.some(x=>x.type==='line'&&dist(x.a,x.b)>1&&Math.abs(cross(unit(sub(x.b,x.a)),u))<.00007&&Math.abs(cross(sub(target.a,x.a),unit(sub(x.b,x.a))))<EPS&&hasLine([x],target.a,add(target.a,mul(u,s.id==='I.9'?1:(dot(sub(x.b,target.a),u)>=0?1:-1)))));}
 if(s.kind==='copyAngle'){const theta=angle(P[3],P[2],P[4]);return drawn.some(x=>x.type==='line'&&[x.a,x.b].some((a,i)=>near(a,P[0])&&Math.abs(angle(P[1],P[0],i?x.a:x.b)-theta)<.00007));}
 if(['triangleBase','squareBase','goldTriangle','similarQuad'].includes(s.kind))return[-1,1].some(sign=>s.out(P,sign).every(x=>hasLine(shapes,x.a,x.b)));
 if(s.kind==='tangent'){const r=dist(P[0],P[1]);return drawn.some(x=>x.type==='line'&&hasLine([x],P[2],project(P[0],x.a,x.b))&&Math.abs(dist(P[0],project(P[0],x.a,x.b))-r)<EPS);}
 if(s.kind==='chord'){const o=P[0],r=dist(P[0],P[1]),wanted=dist(P[2],P[3]),on=ps.filter(x=>Math.abs(dist(x,o)-r)<EPS);for(let i=0;i<on.length;i++)for(let j=i+1;j<on.length;j++)if(Math.abs(dist(on[i],on[j])-wanted)<EPS&&hasLine(drawn,on[i],on[j]))return true;return false;}

 if(s.kind==='angleCircle'){
  const th=angle(P[2],P[3],P[4]);return drawn.some(c=>c.type==='circle'&&Math.abs(dist(c.c,P[0])-c.r)<EPS&&Math.abs(dist(c.c,P[1])-c.r)<EPS&&ps.some(x=>dist(x,P[0])>1&&dist(x,P[1])>1&&Math.abs(dist(x,c.c)-c.r)<EPS&&Math.abs(angle(P[0],x,P[1])-th)<.00007));
 }
 if(s.kind==='angleChord'){
  const r=dist(P[0],P[1]),th=angle(P[2],P[3],P[4]);return drawn.some(l=>l.type==='line'&&(near(l.a,P[1])||near(l.b,P[1]))&&Math.abs(dist(l.a,P[0])-r)<EPS&&Math.abs(dist(l.b,P[0])-r)<EPS&&ps.some(x=>dist(x,l.a)>1&&dist(x,l.b)>1&&Math.abs(dist(x,P[0])-r)<EPS&&Math.abs(angle(l.a,x,l.b)-th)<.00007));
 }
 if(s.kind==='regularIn'||s.kind==='regularOut'){
  const o=P[0],r=dist(P[0],P[1])/(s.kind==='regularOut'?Math.cos(Math.PI/s.n):1);
  return ps.filter(x=>Math.abs(dist(x,o)-r)<EPS).some(x=>hasPolygon(shapes,regular(o,r,s.n,Math.atan2(x.y-o.y,x.x-o.x))));
 }
 if(s.kind==='areaSquare'){
  const side=Math.sqrt(area(P));for(const l of shapes.filter(x=>x.type==='line')){const u=unit(sub(l.b,l.a));for(const a of ps.filter(x=>Math.abs(cross(sub(x,l.a),u))<EPS))for(const sg of[-1,1]){const b=add(a,mul(u,sg*side));if(hasLine(shapes,a,b)&&[-1,1].some(sign=>hasPolygon(shapes,square(a,b,sign))))return true;}}return false;
 }
 if(s.kind==='areaPara'){
  const start=s.id==='I.44'?2:0,count=s.id==='I.45'?4:3,S=area(P.slice(start,start+count)),th=angle(...P.slice(start+count,start+count+3));
  if(s.id==='I.44')return[-1,1].some(sg=>[th,Math.PI-th].some(theta=>hasPolygon(shapes,para(P[0],P[1],S,theta,sg))));
  for(const line of shapes.filter(x=>x.type==='line')){const u=unit(sub(line.b,line.a)),on=ps.filter(x=>Math.abs(cross(sub(x,line.a),u))<EPS);for(const a of on)for(const b of on){if(dist(a,b)<1||!hasLine([line],a,b))continue;for(const sg of[-1,1])for(const theta of[th,Math.PI-th])if(hasPolygon(shapes,para(a,b,S,theta,sg)))return true;}}return false;
 }
 if(['triangleLengths','similarIn','similarOut','similarArea'].includes(s.kind)){
  let want;
  if(s.kind==='triangleLengths')want=[dist(P[0],P[1]),dist(P[2],P[3]),dist(P[4],P[5])];
  if(s.kind==='similarArea'){const source=P.slice(4),k=Math.sqrt(area(P.slice(0,4))/area(source));want=sideLengths(source).map(x=>x*k);}
  if(want){
   const lines=shapes.filter(x=>x.type==='line');
   for(const line of lines){const u=unit(sub(line.b,line.a));const starts=ps.filter(x=>Math.abs(cross(sub(x,line.a),u))<EPS);for(const a of starts)for(const sg of[-1,1])for(let i=0;i<3;i++){const b=add(a,mul(u,want[i]*sg));if(!hasLine(shapes,a,b))continue;for(const flip of[-1,1]){const c=triangleOn(a,b,want[(i+1)%3],want[(i+2)%3],flip);if(hasPolygon(shapes,[a,b,c]))return true;}}}return false;
  }
  let candidates=ps;
  if(s.kind==='similarIn')candidates=ps.filter(x=>Math.abs(dist(P[0],x)-dist(P[0],P[1]))<EPS);
  if(s.kind==='similarOut'){const tangentLines=shapes.filter(x=>x.type==='line'&&Math.abs(dist(P[0],project(P[0],x.a,x.b))-dist(P[0],P[1]))<EPS);candidates=allPoints(tangentLines);}
  return triangleCandidates(shapes,candidates).some(t=>{
   if(!similar(t,P.slice(2)))return false;const r=dist(P[0],P[1]);
   if(s.kind==='similarIn')return t.every(x=>Math.abs(dist(P[0],x)-r)<EPS);
   return near(incenter(...t),P[0])&&Math.abs(dist(P[0],project(P[0],t[0],t[1]))-r)<EPS;
  });
 }
 return false;
}
export {area,angle};
