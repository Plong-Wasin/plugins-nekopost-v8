// ==UserScript==
// @name         nekopost-redirect
// @namespace    https://github.com/Plong-Wasin
// @version      0.1
// @description  nekopost-redirect
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-redirect.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-redirect.user.js
// @match        https://www.nekopost.net/manga
// @match        https://www.nekopost.net//manga
// ==/UserScript==
function ready(fn) {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

ready(() => {
    window.location = "https://www.nekopost.net/project";
});