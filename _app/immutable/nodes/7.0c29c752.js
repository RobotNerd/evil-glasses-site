import{s as D,f as g,l as w,a as $,g as v,h as b,m as y,d as h,c as q,j as _,P as M,i as E,z as p,n as R,H as I,Z as V,R as Z}from"../chunks/scheduler.2c32cff6.js";import{e as x}from"../chunks/each.e59479a4.js";import{S as A,i as B}from"../chunks/index.4fb3896e.js";import{p as F}from"../chunks/stores.9730157c.js";import{G as J}from"../chunks/game-meta.e797e589.js";function z(i,s,c){const r=i.slice();return r[2]=s[c],r}function C(i){let s,c=i[2]+"",r;return{c(){s=g("p"),r=w(c),this.h()},l(n){s=v(n,"P",{class:!0});var a=b(s);r=y(a,c),a.forEach(h),this.h()},h(){_(s,"class","mb-4")},m(n,a){E(n,s,a),p(s,r)},p:I,d(n){n&&h(s)}}}function K(i){let s,c=i[0].params.title+"",r,n,a,m,S,k,u,j=i[1].subtitle+"",G,H,f=x(i[1].description),l=[];for(let t=0;t<f.length;t+=1)l[t]=C(z(i,f,t));return{c(){s=g("h1"),r=w(c),n=$(),a=g("div"),m=g("img"),k=$(),u=g("h3"),G=w(j),H=$();for(let t=0;t<l.length;t+=1)l[t].c();this.h()},l(t){s=v(t,"H1",{class:!0});var o=b(s);r=y(o,c),o.forEach(h),n=q(t),a=v(t,"DIV",{class:!0});var e=b(a);m=v(e,"IMG",{class:!0,src:!0,alt:!0}),k=q(e),u=v(e,"H3",{class:!0});var d=b(u);G=y(d,j),d.forEach(h),H=q(e);for(let P=0;P<l.length;P+=1)l[P].l(e);e.forEach(h),this.h()},h(){_(s,"class","h1 mb-8"),_(m,"class","mb-8"),M(m.src,S=i[1].image)||_(m,"src",S),_(m,"alt","game screenshot"),_(u,"class","h3 mb-4"),_(a,"class","w-3/4 sm:w-1/2")},m(t,o){E(t,s,o),p(s,r),E(t,n,o),E(t,a,o),p(a,m),p(a,k),p(a,u),p(u,G),p(a,H);for(let e=0;e<l.length;e+=1)l[e]&&l[e].m(a,null)},p(t,[o]){if(o&1&&c!==(c=t[0].params.title+"")&&R(r,c),o&2){f=x(t[1].description);let e;for(e=0;e<f.length;e+=1){const d=z(t,f,e);l[e]?l[e].p(d,o):(l[e]=C(d),l[e].c(),l[e].m(a,null))}for(;e<l.length;e+=1)l[e].d(1);l.length=f.length}},i:I,o:I,d(t){t&&(h(s),h(n),h(a)),V(l,t)}}}function L(i,s,c){let r;Z(i,F,a=>c(0,r=a));let n=J[r.params.title];return[r,n]}class W extends A{constructor(s){super(),B(this,s,L,K,D,{})}}export{W as component};
