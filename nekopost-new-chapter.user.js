// ==UserScript==
// @name         nekopost-new-chapter
// @namespace    https://github.com/Plong-Wasin
// @version      0.5
// @description  nekopost-new-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-new-chapter.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost-new-chapter.user.js
// @match        https://www.nekopost.net/novel
// @match        https://www.nekopost.net/project
// @match        https://www.nekopost.net/comic
// @match        https://www.nekopost.net/fiction
// @match        https://www.nekopost.net/
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
    // get chapter from string
    // example: Ch.5.5 - special chapter => 5.5
    // example: Ch.6.5,6,7 - special chapter => 6
    function getChapter(str) {
        let chapter = 0;
        const regex = /Ch\.?\s?(\d+\.?\d*)/g;
        const match = regex.exec(str);
        if (match) {
            chapter = parseFloat(match[1]);
        }
        return chapter;
    }
    function createStyle() {
        const style = document.createElement("style");
        style.innerHTML = `
            .link-to-chapter>a:visited {
                color: var(--bs-green);
            }
        `;
        document.head.appendChild(style);
    }
    function loadMore(loadMoreEls) {
        loadMoreEls.forEach((el) => {
            if (el.getBoundingClientRect().top - 500 < window.innerHeight &&
                el.getBoundingClientRect().height > 0) {
                el.click();
            }
        });
    }
    function getElementsByInnerText(text, selector = "*") {
        const elements = document.querySelectorAll(selector);
        const filteredElements = Array.from(elements).filter((el) => {
            return el.innerText === text;
        });
        return filteredElements;
    }
    function addTagA() {
        const chapterEls = document.querySelectorAll(".txt-elip.my-1:not(link-to-chapter)");
        chapterEls.forEach((el) => {
            const originalText = el.innerText;
            const chapter = getChapter(el.innerText);
            const projectUrl = el.closest("a")?.href || "";
            const tagA = document.createElement("a");
            tagA.href = `${projectUrl}/${chapter}`;
            tagA.innerText = originalText;
            tagA.onclick = () => {
                window.location.href = tagA.href;
                return false;
            };
            el.innerHTML = "";
            el.appendChild(tagA);
            el.classList.add("link-to-chapter");
        });
    }
    function addEventWindowScroll() {
        const loadMoreEls = getElementsByInnerText("More");
        const fncWindowScroll = () => {
            loadMore(loadMoreEls);
            addTagA();
        };
        window.removeEventListener("scroll", fncWindowScroll);
        window.addEventListener("scroll", fncWindowScroll);
    }
    function changeMenu() {
        const menus = document.querySelectorAll("#sidebar-menu a.waves-effect");
        menus.forEach((el) => {
            el.addEventListener("click", () => {
                setTimeout(() => {
                    addEventWindowScroll();
                }, 500);
            });
        });
    }
    ready(() => {
        createStyle();
        addTagA();
        addEventWindowScroll();
        changeMenu();
    });
})();
