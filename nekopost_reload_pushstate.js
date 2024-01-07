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
    function delegate(el, event, selector, fn) {
        el.addEventListener(event, function (e) {
            if (e.target.closest(selector)) {
                fn.call(this, e);
            }
        });
    }
    ready(() => {
        delegate(document, "click", "a", function (e) {
            const target = e.target.closest("a");
            if (target?.closest(".listChapter")) {
                window.location.href = target.href;
            }
        });
    });
})();
