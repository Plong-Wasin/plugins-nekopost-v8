// ==UserScript==
// @name         nekopost-add-style
// @namespace    https://github.com/Plong-Wasin
// @version      0.1
// @description  nekopost-add-style
// @author       Plong-Wasin
// @match        https://www.nekopost.net/*
// @exclude      https://www.nekopost.net/*/*/*
// @grant        none
// ==/UserScript==

$(document).ready(function() {
    document.getElementsByTagName("style")[0].innerHTML +=
        "a[class='svelte-1wjyhvq']:hover,a[class='svelte-1wjyhvq']:visited{color: gray!important;}";
});