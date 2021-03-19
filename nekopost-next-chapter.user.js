// ==UserScript==
// @name         nekopost-next-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.5
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
                $(window).height() + $(window).scrollTop() + 200 >=
                $("table:last").offset().top &&
                !scrollCheck &&
                $("button:last").is(":enabled") &&
                "Close" != $("button:last").html()
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
    setTimeout(() => {
        if ($("button:last").is(":disabled")) {
            $("button:last").html("Close");
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].disabled = false;
            document.getElementsByTagName("button")[
                document.getElementsByTagName("button").length - 1
            ].style = "background-color: red!important;";
            $("button:last").on("click", function() {
                window.close();
            });
        }
    }, 2000);

    // document.getElementsByClassName("btnComment")[0].style.backgroundColor =
    //     "red";
    // $(".btnComment").html("x");
    // $(".btnComment").on("click", function() {
    //     window.close();
    // });
});