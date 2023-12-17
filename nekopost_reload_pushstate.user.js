// ==UserScript==
// @name         nekopost_reload_pushstate
// @namespace    https://github.com/Plong-Wasin
// @version      1.0.0
// @description  nekopost_reload_pushstate
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_reload_pushstate.user.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_reload_pushstate.user.js
// @match        https://www.nekopost.net/manga/*
// @match        https://www.nekopost.net/project/*
// @match        https://2nd.nekopost.net/manga/*
// @exclude      https://www.nekopost.net/manga/*/*
// @exclude      https://2nd.nekopost.net/manga/*/*
// @grant        window.close
// ==/UserScript==
"use strict";
(() => {
    function ready(fn) {
        if (document.readyState != "loading") {
            fn();
        }
        else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    ready(() => {
        var rs = history.pushState;
        history.pushState = function (state, unused, url) {
            rs.apply(history, arguments);
            if (typeof state === "object" &&
                state["sveltekit:index"] &&
                typeof url === "object" &&
                url?.href) {
                window.location.href = url?.href;
            }
        };
    });
})();
