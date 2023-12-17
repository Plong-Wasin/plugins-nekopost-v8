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
