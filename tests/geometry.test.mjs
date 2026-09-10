import assert from 'node:assert/strict';
import {PROPOSITIONS,setup,construct,validate} from '../dist/propositions.js';
import {intersect,allPoints,hasLine,segment,circle,dist,mid,add,mul,sub} from '../dist/geometry.js';
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++;};
// Every level rejects its seed and accepts a complete geometric result.
for(const s of PROPOSITIONS){const init=setup(s);ok(!validate(s,init.shapes,init.points),s.id+' must not start solved');let result=s.special==='bisectArc'?{shapes:[],points:[s.target]}:construct(s,s.pts);if(s.kind==='angleCircle'){const c=result.shapes[0];result.points.push({x:c.c.x,y:c.c.y-c.r});}if(s.kind==='angleChord'){const c=init.shapes.find(x=>x.type==='circle'),l=result.shapes[0],m=mid(l.a,l.b),v=sub(m,c.c);result.points.push(add(c.c,mul(v,-c.r/Math.hypot(v.x,v.y))));}ok(validate(s,[...init.shapes,...result.shapes],[...init.points,...result.points]),s.id+' complete result');}
// Solve I.1 using only the primitives, with exact computed circle intersections.
const first=PROPOSITIONS[0],initial=setup(first),[A,B]=first.pts,r=dist(A,B),c1=circle(A,r),c2=circle(B,r),X=intersect(c1,c2)[0];
ok(!validate(first,[...initial.shapes,c1,c2,segment(A,X)],initial.points),'one triangle side is incomplete');
ok(validate(first,[...initial.shapes,c1,c2,segment(A,X),segment(B,X)],initial.points),'primitive equilateral triangle');
// Circle intersections, tangent multiplicity, and finite line bounds.
ok(intersect(circle({x:0,y:0},5),circle({x:10,y:0},5)).length===1,'tangent circles yield one point');
ok(intersect(segment({x:0,y:0},{x:1,y:0}),segment({x:2,y:-1},{x:2,y:1})).length===0,'finite bounds');
ok(intersect({...segment({x:0,y:0},{x:1,y:0}),extended:true},segment({x:2,y:-1},{x:2,y:1})).length===1,'extended line intersections');
ok(hasLine([segment({x:0,y:0},{x:5,y:0}),segment({x:5,y:0},{x:10,y:0})],{x:0,y:0},{x:10,y:0}),'contiguous edge coverage');
ok(!hasLine([segment({x:0,y:0},{x:4,y:0}),segment({x:6,y:0},{x:10,y:0})],{x:0,y:0},{x:10,y:0}),'gaps are rejected');
const center=PROPOSITIONS.find(s=>s.id==='III.1'),cs=setup(center),hidden=center.point(center.pts);ok(!allPoints(cs.shapes,cs.points).some(p=>dist(p,hidden)<.015),'circle center must remain hidden');
const arc={type:'arc',c:{x:0,y:0},r:5,start:-Math.PI,end:0,hideCenter:true};ok(intersect(arc,segment({x:0,y:-10},{x:0,y:10})).length===1,'arc filters the other semicircle');
const perpendicular=PROPOSITIONS.find(s=>s.id==='I.12'),perpSeed=setup(perpendicular);ok(!validate(perpendicular,[...perpSeed.shapes,segment({x:555,y:240},{x:555,y:237})],perpSeed.points),'perpendicular must reach the foot');
for(const id of ['II.14','I.42','I.45']){const s=PROPOSITIONS.find(x=>x.id===id),seed=setup(s),res=construct(s,s.pts);const translated=res.shapes.map(l=>{const a=add(l.a,{x:210,y:140}),b=add(l.b,{x:210,y:140}),v=sub(b,a);return segment(add(a,mul(v,-.4)),add(b,mul(v,.3)));});ok(validate(s,[...seed.shapes,...translated],seed.points),id+' accepts intersection-defined corners');}
console.log(`${checks} geometry checks passed across ${PROPOSITIONS.length} propositions.`);
