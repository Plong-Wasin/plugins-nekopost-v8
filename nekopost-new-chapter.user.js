// ==UserScript==
// @name         nekopost-new-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.3
// @description  nekopost-new-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-new-chapter.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-new-chapter.user.js
// @match        https://www.nekopost.net/novel
// @match        https://www.nekopost.net/project
// @match        https://www.nekopost.net/comic
// @match        https://www.nekopost.net/fiction
// @match        https://www.nekopost.net/
// ==/UserScript==
(()=>{function e(e,t,n){return""==t?e.substring(0,e.indexOf(n)):e.substring(e.indexOf(t)+1,e.indexOf(n))}function t(e){"loading"!=document.readyState?e():document.addEventListener("DOMContentLoaded",e)}function n(){for(let t=0;t<document.querySelectorAll(".col-6.col-sm-4.col-md-3.col-lg-3.col-xl-2.p-2.svelte-gbfxcs").length;t++){if(-1!=document.querySelectorAll(".svelte-gbfxcs[style]")[t].innerHTML.search("<a"))continue;let n=document.querySelectorAll(".col-6.col-sm-4.col-md-3.col-lg-3.col-xl-2.p-2.svelte-gbfxcs")[t].children[0].href+"/",l=e(document.querySelectorAll(".svelte-gbfxcs[style]")[t].innerHTML,"."," ");-1!=l.search(",")?n+=e(l,"",","):n+=l,document.querySelectorAll(".svelte-gbfxcs[style]")[t].innerHTML=`<a href='${n}'>${document.querySelectorAll(".svelte-gbfxcs[style]")[t].innerHTML}</a>`}}function l(){let e=document.createElement("style");e.innerHTML="span.svelte-gbfxcs>a:visited{color: rgb(152, 154, 157) !important;}",document.head.appendChild(e)}function o(){s=document.images,r=s.length,i=0,[].forEach.call(s,function(e){e.complete?c():(e.addEventListener("load",c,!1),e.addEventListener("error",c,!1))})}function c(){i++,i===r&&n()}t(()=>{[].forEach.call(document.getElementsByClassName("more"),function(e){e.addEventListener("click",()=>{setTimeout(()=>{o()},500),setTimeout(()=>{o()},1e3),setTimeout(()=>{o()},5e3)})}),l(),setTimeout(()=>{o()},1e3),window.addEventListener("scroll",()=>{document.getElementsByClassName("more")[0].getBoundingClientRect().top-window.innerHeight<0&&"https://www.nekopost.net/"!=window.location.href&&document.getElementsByClassName("more")[0].click()})});let s=document.images,r=s.length,i=0})();
