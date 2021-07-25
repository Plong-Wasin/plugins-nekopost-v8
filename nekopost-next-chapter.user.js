// ==UserScript==
// @name         nekopost-next-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.7
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
    while (!checkLoadState);
    insertImg();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkLoadState() {
    if (document.images.length > 5) {
        return true;
    }
    return false;
    // await sleep(1000);
    // checkLoadState();
}

function insertImg() {
    let splitUrl = window.location.href.split("/");
    let nc_chapter_id, np_project_id, nc_chapter_no;
    np_project_id = splitUrl[splitUrl.length - 2];
    nc_chapter_no = splitUrl[splitUrl.length - 1];
    const d = new Date();
    let date = d.getFullYear() + ((parseInt(d.getMonth()) + 1) >= 10 ? (parseInt(d.getMonth()) + 1) : '0' + (parseInt(d.getMonth()) + 1)) + ((parseInt(d.getDate())) >= 10 ? (parseInt(d.getDate())) : '0' + (parseInt(d.getDate()))) + ((parseInt(d.getHours())) >= 10 ? (parseInt(d.getHours())) : '0' + (parseInt(d.getHours()))) + ((parseInt(d.getMinutes())) >= 10 ? (parseInt(d.getMinutes())) : '0' + (parseInt(d.getMinutes())))
    fetch(
            `https://tuner.nekopost.net/ApiTest/getProjectDetailFull/${np_project_id}`
        )
        .then((response) => response.json())
        .then((json) => {
            for (item of json.projectChapterList) {
                if (item.nc_chapter_no == nc_chapter_no) {
                    nc_chapter_id = item.nc_chapter_id;
                    break;
                }
            }
            fetch(
                    `https://fs.nekopost.net/collectManga/${np_project_id}/${nc_chapter_id}/${np_project_id}_${nc_chapter_id}.json?${date}`
                )
                .then((response2) => response2.json())
                .then((json2) => {
                    for (let i = 0; i < json2.pageItem.length; i++) {
                        document.querySelectorAll('img.svelte-14e4tz0')[i].src = `https://fs.nekopost.net/collectManga/${np_project_id}/${nc_chapter_id}/${json2.pageItem[i].fileName}`
                    }

                });
        });
}