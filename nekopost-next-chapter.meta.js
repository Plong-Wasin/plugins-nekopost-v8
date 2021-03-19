// ==UserScript==
// @name         nekopost-next-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.1
// @description  nekopost-next-chapter
// @author       Plong-Wasin
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
    document.getElementsByClassName("btnComment")[0].style.backgroundColor =
        "red";
    $(".btnComment").html("x");
    $(".btnComment").on("click", function() {
        window.close();
    });
});