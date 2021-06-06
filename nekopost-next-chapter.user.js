// ==UserScript==
// @name         nekopost-next-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.6
// @description  nekopost-next-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-next-chapter.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-next-chapter.user.js
// @match        https://www.nekopost.net/*/*/*
// @grant        window.close
// ==/UserScript==
let scrollCheck = false;
let history = false;

function ready(fn) {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

ready(function() {
    window.addEventListener("pageshow", function(event) {
        var historyTraversal =
            event.persisted ||
            (typeof window.performance != "undefined" &&
                window.performance.navigation.type === 2);
        if (historyTraversal) {
            // Handle page restore.
            history = true;
        }
    });
    if (!history) {
        window.addEventListener("scroll", () => {
            if (
                window.innerHeight + window.screenY >=
                document
                .querySelectorAll("table")[
                    document.querySelectorAll("table").length - 1
                ].getBoundingClientRect().top &&
                !scrollCheck &&
                !document.querySelectorAll("button")[
                    document.querySelectorAll("button").length - 1
                ].disabled &&
                "Close" !=
                document.querySelectorAll("button")[
                    document.querySelectorAll("button").length - 1
                ].innerHTML
            ) {
                scrollCheck = true;
                document
                    .querySelectorAll("button")[document.querySelectorAll("button").length - 1].click();
            }
        });
    }
    document.getElementsByClassName(
        "fad fa-comments-alt"
    )[0].parentNode.style.backgroundColor = "red";
    document
        .getElementsByClassName("fad fa-comments-alt")[0]
        .parentNode.addEventListener("click", function() {
            window.close();
        });
    document.getElementsByClassName(
        "fad fa-comments-alt"
    )[0].parentNode.innerHTML = "X";
    setTimeout(() => {
        if (
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].disabled
        ) {
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].innerHTML = "Close";
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].disabled = false;
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].style = "background-color: red!important;";
            document
                .getElementsByTagName("button")[document.getElementsByTagName("button").length - 1].addEventListener(
                    "click",
                    () => {
                        window.close();
                    }
                );
        }
    }, 2000);
});