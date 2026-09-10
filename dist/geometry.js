export const EPS=0.015;
export const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y}), sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}), mul=(a,t)=>({x:a.x*t,y:a.y*t}), dot=(a,b)=>a.x*b.x+a.y*b.y, cross=(a,b)=>a.x*b.y-a.y*b.x;
export const len=a=>Math.hypot(a.x,a.y), dist=(a,b)=>len(sub(a,b)), unit=a=>mul(a,1/(len(a)||1)), perp=a=>({x:-a.y,y:a.x}), mid=(a,b)=>mul(add(a,b),.5), near=(a,b,t=EPS)=>dist(a,b)<t;
export const rotate=(a,t)=>({x:a.x*Math.cos(t)-a.y*Math.sin(t),y:a.x*Math.sin(t)+a.y*Math.cos(t)});
export const project=(p,a,b)=>add(a,mul(sub(b,a),dot(sub(p,a),sub(b,a))/dot(sub(b,a),sub(b,a))));
const onArc=(p,s)=>{if(s.type!=='arc')return true;let t=Math.atan2(p.y-s.c.y,p.x-s.c.x);while(t<s.start-1e-7)t+=2*Math.PI;return t<=s.end+1e-7;};
export function intersect(a,b){
 if(a.type==='arc'||b.type==='arc')return intersect(a.type==='arc'?{...a,type:'circle'}:a,b.type==='arc'?{...b,type:'circle'}:b).filter(p=>onArc(p,a)&&onArc(p,b));
 if(a.type==='circle'&&b.type!=='circle')return intersect(b,a);
 if(a.type!=='circle'&&b.type!=='circle'){
  const u=sub(a.b,a.a),v=sub(b.b,b.a),d=cross(u,v);if(Math.abs(d)<1e-9)return[];
  const t=cross(sub(b.a,a.a),v)/d,w=cross(sub(b.a,a.a),u)/d;
  if((!a.extended&&(t<-1e-8||t>1+1e-8))||(!b.extended&&(w<-1e-8||w>1+1e-8)))return[];
  return[add(a.a,mul(u,t))];
 }
 if(a.type!=='circle'){
  const v=sub(a.b,a.a),w=sub(a.a,b.c),A=dot(v,v),B=2*dot(v,w),C=dot(w,w)-b.r*b.r,D=B*B-4*A*C;
  if(A<1e-10||D<-1e-6)return[];
  const ts=[(-B+Math.sqrt(Math.max(0,D)))/(2*A),(-B-Math.sqrt(Math.max(0,D)))/(2*A)];
  return ts.filter(t=>a.extended||(t>=-1e-8&&t<=1+1e-8)).map(t=>add(a.a,mul(v,t))).filter((p,i,ps)=>!i||!near(p,ps[0]));
 }
 const d=dist(a.c,b.c);if(d<1e-9||d>a.r+b.r+1e-6||d<Math.abs(a.r-b.r)-1e-6)return[];
 const x=(a.r*a.r-b.r*b.r+d*d)/(2*d),h=Math.sqrt(Math.max(0,a.r*a.r-x*x)),u=unit(sub(b.c,a.c)),m=add(a.c,mul(u,x));
 return[add(m,mul(perp(u),h)),add(m,mul(perp(u),-h))].filter((p,i,ps)=>!i||!near(p,ps[0]));
}
export function circumcenter(a,b,c){const d=2*cross(sub(b,a),sub(c,a));if(Math.abs(d)<1e-8)return null;const u=sub(b,a),v=sub(c,a);return add(a,{x:(dot(u,u)*v.y-dot(v,v)*u.y)/d,y:(u.x*dot(v,v)-v.x*dot(u,u))/d});}
export function incenter(a,b,c){const x=dist(b,c),y=dist(a,c),z=dist(a,b);return mul(add(add(mul(a,x),mul(b,y)),mul(c,z)),1/(x+y+z));}
export function regular(c,r,n,start=-Math.PI/2){return Array.from({length:n},(_,i)=>add(c,{x:r*Math.cos(start+i*2*Math.PI/n),y:r*Math.sin(start+i*2*Math.PI/n)}));}
export const segment=(a,b,extra={})=>({type:'line',a,b,...extra});
export const circle=(c,r,extra={})=>({type:'circle',c,r,...extra});
export const polygon=ps=>ps.map((p,i)=>segment(p,ps[(i+1)%ps.length]));
export function allPoints(shapes,points=[]){let ps=[...points];for(const s of shapes)ps.push(...(s.type==='circle'||s.type==='arc'?(s.hideCenter?[]:[s.c]):[s.a,s.b]));for(let i=0;i<shapes.length;i++)for(let j=0;j<i;j++)ps.push(...intersect(shapes[i],shapes[j]));const bins=new Map(),out=[];for(const p of ps){if(!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;const x=Math.floor(p.x/EPS),y=Math.floor(p.y/EPS);let exists=false;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)if((bins.get((x+i)+','+(y+j))||[]).some(q=>near(p,q)))exists=true;if(exists)continue;const k=x+','+y;if(!bins.has(k))bins.set(k,[]);bins.get(k).push(p);out.push(p);}return out;}
export function hasLine(shapes,a,b){if(near(a,b))return false;const u=unit(sub(b,a)),length=dist(a,b),intervals=[];for(const s of shapes){if(s.type!=='line'||dist(s.a,s.b)<1e-8)continue;if(Math.abs(cross(sub(s.a,a),u))>EPS||Math.abs(cross(sub(s.b,a),u))>EPS)continue;if(s.extended)return true;const t=dot(sub(s.a,a),u),v=dot(sub(s.b,a),u);intervals.push([Math.min(t,v),Math.max(t,v)]);}intervals.sort((a,b)=>a[0]-b[0]);let covered=0;for(const[lo,hi]of intervals){if(hi<covered-EPS)continue;if(lo>covered+EPS)return false;covered=Math.max(covered,hi);if(covered>=length-EPS)return true;}return false;}
export const hasCircle=(shapes,c,r)=>shapes.some(s=>s.type==='circle'&&near(s.c,c)&&Math.abs(s.r-r)<EPS);
export const hasPolygon=(shapes,ps)=>ps.every((p,i)=>hasLine(shapes,p,ps[(i+1)%ps.length]));
export function nearestOnShape(p,s){if(s.type==='circle'||s.type==='arc'){if(dist(p,s.c)<1e-9)return null;const q=add(s.c,mul(unit(sub(p,s.c)),s.r));return onArc(q,s)?q:null;}const q=project(p,s.a,s.b);if(s.extended)return q;const t=dot(sub(q,s.a),sub(s.b,s.a))/dot(sub(s.b,s.a),sub(s.b,s.a));return t<0?s.a:t>1?s.b:q;}
