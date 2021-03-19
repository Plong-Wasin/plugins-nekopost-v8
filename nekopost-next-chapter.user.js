// ==UserScript==
// @name         nekopost-next-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.2
// @description  nekopost-next-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-next-chapter.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-next-chapter.user.js
// @match        https://www.nekopost.net/*/*/*
// @grant        window.close
// ==/UserScript==
let scrollCheck = false;
let history = false;
$(document).ready(function() {
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
        $(window).scroll(function() {
            if (
                $(window).height() + $(window).scrollTop() >=
                $("table:last").offset().top &&
                !scrollCheck &&
                $("button:last").is(":enabled")
            ) {
                scrollCheck = true;
                $("button:last").click();
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

    // document.getElementsByClassName("btnComment")[0].style.backgroundColor =
    //     "red";
    // $(".btnComment").html("x");
    // $(".btnComment").on("click", function() {
    //     window.close();
    // });
});