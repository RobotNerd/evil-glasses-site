import{s as q,a as b,f as d,c as x,g as p,h as y,d as u,j as o,i as v,H as C,Z as A,Y as G,l as H,m as I,P,z as _,n as N}from"./scheduler.2c32cff6.js";import{e as j}from"./each.e59479a4.js";import{S as z,i as D}from"./index.4fb3896e.js";function w(c,e,s){const t=c.slice();return t[1]=e[s],t}function E(c){let e,s="Get your copy now!";return{c(){e=d("h3"),e.textContent=s,this.h()},l(t){e=p(t,"H3",{class:!0,"data-svelte-h":!0}),G(e)!=="svelte-1a18nyt"&&(e.textContent=s),this.h()},h(){o(e,"class","h3 mb-4")},m(t,r){v(t,e,r)},d(t){t&&u(e)}}}function S(c){let e,s,t,r,i,l,n=c[1].label+"",a,m,g;return{c(){e=d("a"),s=d("img"),i=b(),l=d("span"),a=H(n),m=b(),this.h()},l(h){e=p(h,"A",{class:!0,href:!0});var f=y(e);s=p(f,"IMG",{class:!0,src:!0,alt:!0}),i=x(f),l=p(f,"SPAN",{class:!0});var k=y(l);a=I(k,n),k.forEach(u),m=x(f),f.forEach(u),this.h()},h(){o(s,"class","m-1 w-8/12"),P(s.src,t=c[1].image)||o(s,"src",t),o(s,"alt",r=c[1].label),o(l,"class","text-xs"),o(e,"class","card variant-ghost-primary card-hover mb-4 flex w-3/4 flex-col items-center justify-center rounded-lg p-4"),o(e,"href",g=c[1].url)},m(h,f){v(h,e,f),_(e,s),_(e,i),_(e,l),_(l,a),_(e,m)},p(h,f){f&1&&!P(s.src,t=h[1].image)&&o(s,"src",t),f&1&&r!==(r=h[1].label)&&o(s,"alt",r),f&1&&n!==(n=h[1].label+"")&&N(a,n),f&1&&g!==(g=h[1].url)&&o(e,"href",g)},d(h){h&&u(e)}}}function L(c){let e,s,t=c[0].length>0&&E(),r=j(c[0]),i=[];for(let l=0;l<r.length;l+=1)i[l]=S(w(c,r,l));return{c(){t&&t.c(),e=b(),s=d("div");for(let l=0;l<i.length;l+=1)i[l].c();this.h()},l(l){t&&t.l(l),e=x(l),s=p(l,"DIV",{class:!0});var n=y(s);for(let a=0;a<i.length;a+=1)i[a].l(n);n.forEach(u),this.h()},h(){o(s,"class","flex flex-col items-center justify-evenly")},m(l,n){t&&t.m(l,n),v(l,e,n),v(l,s,n);for(let a=0;a<i.length;a+=1)i[a]&&i[a].m(s,null)},p(l,[n]){if(l[0].length>0?t||(t=E(),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null),n&1){r=j(l[0]);let a;for(a=0;a<r.length;a+=1){const m=w(l,r,a);i[a]?i[a].p(m,n):(i[a]=S(m),i[a].c(),i[a].m(s,null))}for(;a<i.length;a+=1)i[a].d(1);i.length=r.length}},i:C,o:C,d(l){l&&(u(e),u(s)),t&&t.d(l),A(i,l)}}}function M(c,e,s){let{items:t}=e;return c.$$set=r=>{"items"in r&&s(0,t=r.items)},[t]}class B extends z{constructor(e){super(),D(this,e,M,L,q,{items:0})}}export{B as P};