import{s as j,a as k,f as h,c as w,g as u,h as C,d as o,j as f,i as m,H as d,Z as P,Y as q,P as g,z as p}from"./scheduler.2c32cff6.js";import{e as v}from"./each.e59479a4.js";import{S as E,i as G}from"./index.4fb3896e.js";function x(c,e,a){const t=c.slice();return t[1]=e[a],t}function y(c){let e,a="Get your copy now!";return{c(){e=h("h3"),e.textContent=a,this.h()},l(t){e=u(t,"H3",{class:!0,"data-svelte-h":!0}),q(e)!=="svelte-1a18nyt"&&(e.textContent=a),this.h()},h(){f(e,"class","h3 mb-4")},m(t,n){m(t,e,n)},d(t){t&&o(e)}}}function b(c){let e,a,t,n,i,s;return{c(){e=h("a"),a=h("img"),i=k(),this.h()},l(r){e=u(r,"A",{class:!0,href:!0});var l=C(e);a=u(l,"IMG",{class:!0,src:!0,alt:!0}),i=w(l),l.forEach(o),this.h()},h(){f(a,"class","mr-2 w-8/12 xl:w-11/12"),g(a.src,t=c[1].image)||f(a,"src",t),f(a,"alt",n=c[1].label),f(e,"class","my-1 flex flex-col items-center xl:items-start"),f(e,"href",s=c[1].url)},m(r,l){m(r,e,l),p(e,a),p(e,i)},p(r,l){l&1&&!g(a.src,t=r[1].image)&&f(a,"src",t),l&1&&n!==(n=r[1].label)&&f(a,"alt",n),l&1&&s!==(s=r[1].url)&&f(e,"href",s)},d(r){r&&o(e)}}}function H(c){let e,a,t=c[0].length>0&&y(),n=v(c[0]),i=[];for(let s=0;s<n.length;s+=1)i[s]=b(x(c,n,s));return{c(){t&&t.c(),e=k(),a=h("div");for(let s=0;s<i.length;s+=1)i[s].c();this.h()},l(s){t&&t.l(s),e=w(s),a=u(s,"DIV",{class:!0});var r=C(a);for(let l=0;l<i.length;l+=1)i[l].l(r);r.forEach(o),this.h()},h(){f(a,"class","flex flex-col items-center justify-evenly xl:flex-row xl:items-start xl:justify-start xl:content-start")},m(s,r){t&&t.m(s,r),m(s,e,r),m(s,a,r);for(let l=0;l<i.length;l+=1)i[l]&&i[l].m(a,null)},p(s,[r]){if(s[0].length>0?t||(t=y(),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null),r&1){n=v(s[0]);let l;for(l=0;l<n.length;l+=1){const _=x(s,n,l);i[l]?i[l].p(_,r):(i[l]=b(_),i[l].c(),i[l].m(a,null))}for(;l<i.length;l+=1)i[l].d(1);i.length=n.length}},i:d,o:d,d(s){s&&(o(e),o(a)),t&&t.d(s),P(i,s)}}}function I(c,e,a){let{items:t}=e;return c.$$set=n=>{"items"in n&&a(0,t=n.items)},[t]}class D extends E{constructor(e){super(),G(this,e,I,H,j,{items:0})}}export{D as P};
