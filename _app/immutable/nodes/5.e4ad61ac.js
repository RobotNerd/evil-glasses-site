import{s as F,f as _,l as y,a as $,g as f,h as E,m as C,d as c,c as k,Y as J,j as n,P as K,i as L,z as s,n as N,R as O}from"../chunks/scheduler.2c32cff6.js";import{S as Q,i as T,b as U,d as W,m as X,a as Z,t as tt,e as et}from"../chunks/index.4fb3896e.js";import{p as st}from"../chunks/stores.9730157c.js";import{B as at}from"../chunks/book-meta.f38bcd88.js";import{P as rt}from"../chunks/PurchaseLinks.d4d61ff7.js";function lt(l){let r,m=l[0].params.title+"",o,d,t,u,S,w,p,H,v,j=l[1].subtitle+"",I,q,b,z=l[1].synopsis+"",x,A,h,G="About the Author",B,g,M=l[1].authorDescription+"",D,P;return p=new rt({props:{items:l[1].purchaseLinks}}),{c(){r=_("h1"),o=y(m),d=$(),t=_("div"),u=_("img"),w=$(),U(p.$$.fragment),H=$(),v=_("h3"),I=y(j),q=$(),b=_("p"),x=y(z),A=$(),h=_("h3"),h.textContent=G,B=$(),g=_("p"),D=y(M),this.h()},l(e){r=f(e,"H1",{class:!0});var i=E(r);o=C(i,m),i.forEach(c),d=k(e),t=f(e,"DIV",{class:!0});var a=E(t);u=f(a,"IMG",{class:!0,src:!0,alt:!0}),w=k(a),W(p.$$.fragment,a),H=k(a),v=f(a,"H3",{class:!0});var R=E(v);I=C(R,j),R.forEach(c),q=k(a),b=f(a,"P",{class:!0});var V=E(b);x=C(V,z),V.forEach(c),A=k(a),h=f(a,"H3",{class:!0,"data-svelte-h":!0}),J(h)!=="svelte-1u2n9ar"&&(h.textContent=G),B=k(a),g=f(a,"P",{class:!0});var Y=E(g);D=C(Y,M),Y.forEach(c),a.forEach(c),this.h()},h(){n(r,"class","h1 mb-8"),n(u,"class","mb-8"),K(u.src,S=l[1].coverImage)||n(u,"src",S),n(u,"alt","book cover"),n(v,"class","h3 mb-4"),n(b,"class","mb-4"),n(h,"class","h3 mb-4"),n(g,"class","mb-4"),n(t,"class","w-3/4 sm:w-1/2")},m(e,i){L(e,r,i),s(r,o),L(e,d,i),L(e,t,i),s(t,u),s(t,w),X(p,t,null),s(t,H),s(t,v),s(v,I),s(t,q),s(t,b),s(b,x),s(t,A),s(t,h),s(t,B),s(t,g),s(g,D),P=!0},p(e,[i]){(!P||i&1)&&m!==(m=e[0].params.title+"")&&N(o,m)},i(e){P||(Z(p.$$.fragment,e),P=!0)},o(e){tt(p.$$.fragment,e),P=!1},d(e){e&&(c(r),c(d),c(t)),et(p)}}}function nt(l,r,m){let o;O(l,st,t=>m(0,o=t));let d=at[o.params.title];return[o,d]}class pt extends Q{constructor(r){super(),T(this,r,nt,lt,F,{})}}export{pt as component};
