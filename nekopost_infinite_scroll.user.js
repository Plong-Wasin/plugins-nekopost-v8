// ==UserScript==
// @name         nekopost_infinite_scroll
// @namespace    https://github.com/Plong-Wasin
// @version      1.3.7
// @description  nekopost-next-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_infinite_scroll.user.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_infinite_scroll.user.js
// @match        https://www.nekopost.net/manga/*/*
// @grant        window.close
// ==/UserScript==
"use strict";
(() => {
    let host = "";
    let prototypeEl;
    const splitUrl = window.location.pathname.split("/");
    const projectId = splitUrl[splitUrl.length - 2];
    let chapterNo = parseFloat(splitUrl[splitUrl.length - 1]);
    const mangaPageSelector = ".t-center.item-content";
    function ready(fn) {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // get current date
    // e.g. 2021-01-01 00:00L00 => 20211201000000
    function currentDate() {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = `0${(now.getMonth() + 1).toString()}`.slice(-2);
        const day = `0${now.getDate()}`.slice(-2);
        const hour = `0${now.getHours()}`.slice(-2);
        const minute = `0${now.getMinutes()}`.slice(-2);
        const second = `0${now.getSeconds()}`.slice(-2);
        const millisecond = `00${now.getMilliseconds()}`.slice(-3);
        return year + month + day + hour + minute + second + millisecond;
    }
    async function getProjectDetailFull(projectId) {
        const response = await fetch(
            `https://uatapi.nekopost.net/frontAPI/getProjectInfo/${projectId}`
        );
        return response.json();
    }
    async function getChapterDetails(projectId, chapterId, date) {
        const response = await fetch(
            `${host}/collectManga/${projectId}/${chapterId}/${projectId}_${chapterId}.json?${date}`
        );
        return response.json();
    }
    function clearPage() {
        const els = document.querySelectorAll(
            `${mangaPageSelector}:not(#mangaImages ${mangaPageSelector})`
        );
        els.forEach((el) => {
            el.remove();
        });
    }
    function removeDisplayActiveClass(el) {
        el.classList.remove("display0", "display1", "display2", "display3");
    }
    function insertPage(projectId, chapterId, pageName, pageNo, totalPages) {
        const cloneEl = prototypeEl?.cloneNode(true);
        const appendEl = document.querySelector("#mangaImages");
        const sizeEls = document.querySelectorAll(
            ".size-range li.svelte-fv9tk4"
        );
        let displayActive = 0;
        for (let i = 0; i < sizeEls.length; i++) {
            const el = sizeEls[i];
            if (el.classList.contains("active")) {
                displayActive = i;
            }
        }
        if (cloneEl) {
            const imgEl = cloneEl.querySelector("img");
            const pageEl = cloneEl.querySelector("p");
            if (imgEl) {
                imgEl.src = `${host}/collectManga/${projectId}/${chapterId}/${pageName}`;
                imgEl.loading = "lazy";
                removeDisplayActiveClass(imgEl);
                imgEl.classList.add(`display${displayActive}`);
                imgEl.style.minHeight = `250px`;
            }
            if (pageEl) {
                pageEl.innerText = `Page No.${pageNo}/${totalPages}`;
            }
            if (appendEl) {
                appendEl.appendChild(cloneEl);
            }
        }
    }
    function createElementPage() {
        const parentEl = document.querySelector(mangaPageSelector)?.parentNode;
        if (parentEl) {
            const newItem = document.createElement("div");
            newItem.id = "mangaImages";
            parentEl.appendChild(newItem);
        }
    }
    async function checkLoadState() {
        if (document.querySelectorAll(mangaPageSelector).length > 0) {
            return true;
        }
        await sleep(500);
        return false;
    }
    async function loadChapter(chapterNo, projectDetails) {
        // get chapter id from chapter no
        const chapterId = projectDetails.listChapter.find(
            (chapter) => chapter.chapterNo === chapterNo
        )?.chapterId;
        if (chapterId) {
            const projectId = projectDetails.projectInfo.projectId;
            const chapterInfo = await getChapterDetails(
                projectId,
                chapterId,
                currentDate()
            );
            chapterInfo.pageItem.sort((a, b) => a.pageNo - b.pageNo);
            if (chapterInfo) {
                const totalPages = chapterInfo.pageItem.length;
                chapterInfo.pageItem.forEach((page) => {
                    insertPage(
                        projectId,
                        chapterId,
                        page.pageName || page.fileName || "",
                        page.pageNo,
                        totalPages
                    );
                });
                changeUrl(chapterNo);
            }
        }
    }
    function getNextChapterNo(currentChapterNo, projectDetails) {
        const chapterList = projectDetails.listChapter;
        // get index from chapter no
        const currentIndex = chapterList.findIndex(
            (chapter) => +chapter.chapterNo === +currentChapterNo
        );
        return currentIndex > 0 ? chapterList[currentIndex - 1].chapterNo : -1;
    }
    function onloadImages() {
        const errorElements = [];
        function load(e) {
            const lazyLoadImages =
                document.querySelectorAll("#mangaImages img") || [];
            const multipleLoad = 3;
            // nodeList to array
            const lazyLoadImagesArray = Array.from(lazyLoadImages);
            // get index from this element
            const index = lazyLoadImagesArray.indexOf(this);
            // change all previous element to loading auto
            lazyLoadImagesArray.slice(0, index).forEach((el) => {
                el.loading = "eager";
            });
            if (lazyLoadImagesArray.length > index + 1) {
                // change next element to loading auto
                lazyLoadImagesArray[index + 1].loading = "eager";
            }
            // find incomplete
            const incompleteElements = lazyLoadImagesArray.filter(
                (el) => el.complete === false
            );
            if (incompleteElements) {
                incompleteElements
                    .slice(0, multipleLoad + errorElements.length)
                    .forEach((el) => {
                        el.loading = "eager";
                    });
            }
        }
        function error(e) {
            setTimeout(() => {
                const errorCount = +(this.dataset.errorCount || 0);
                if (errorCount < 3) {
                    // push to error elements if not exist
                    if (!errorElements.includes(this)) {
                        errorElements.push(this);
                    }
                    const src = this.src;
                    this.src = src;
                    this.dataset.errorCount = (errorCount + 1).toString();
                }
            }, 1000);
            load.call(this, e);
        }
        function addEvent(eventName, handler) {
            const rootEl = document.querySelector("#mangaImages");
            rootEl?.addEventListener(
                eventName,
                function (e) {
                    for (
                        let target = e.target;
                        target && target != this;
                        target = target.parentNode
                    ) {
                        if (target.matches("img")) {
                            handler.call(target, e);
                            break;
                        }
                    }
                },
                true
            );
        }
        addEvent("load", load);
        addEvent("error", error);
    }
    function addScrollEvent(projectDetails) {
        const mangaImagesEl = document.querySelector("#mangaImages");
        if (mangaImagesEl) {
            let isLoading = false;
            window.addEventListener("scroll", function eventScrollLoadPage() {
                // if scroll near bottom of mangaImageEl
                if (
                    mangaImagesEl.getBoundingClientRect().bottom -
                        window.innerHeight * 2 <=
                        0 &&
                    !isLoading
                ) {
                    isLoading = true;
                    chapterNo = getNextChapterNo(chapterNo, projectDetails);
                    if (chapterNo > 0) {
                        void (async () => {
                            await loadChapter(chapterNo, projectDetails);
                            isLoading = false;
                        })();
                    }
                    if (getNextChapterNo(chapterNo, projectDetails) === -1) {
                        document.querySelector("#loadAllChapterBtn")?.remove();
                        window.removeEventListener(
                            "scroll",
                            eventScrollLoadPage
                        );
                    }
                }
            });
        }
    }
    function closeBtn() {
        const btnEl = document.querySelector(
            ".layout-helper.svelte-ixpqjn button"
        );
        const commentEl = document.querySelector(
            ".layout-helper.svelte-ixpqjn a"
        );
        const cloneEl = btnEl?.cloneNode(true);
        if (cloneEl && commentEl) {
            cloneEl.style.backgroundColor = "red";
            cloneEl.innerText = "X";
            cloneEl.addEventListener("click", () => {
                window.close();
            });
            commentEl.remove();
            // insert first child .layout-helper.svelte-ixpqjn
            const parentEl = document.querySelector(
                ".layout-helper.svelte-ixpqjn"
            );
            if (parentEl) {
                parentEl.insertBefore(cloneEl, parentEl.firstChild);
            }
        }
    }
    function loadAllChapterBtn(projectDetails) {
        const btnEl = document.querySelector(
            ".layout-helper.svelte-ixpqjn button"
        );
        const cloneEl = btnEl?.cloneNode(true);
        if (cloneEl) {
            cloneEl.style.backgroundColor = "green";
            cloneEl.innerText = "All";
            cloneEl.style.marginRight = "5px";
            cloneEl.id = "loadAllChapterBtn";
            cloneEl.addEventListener("click", function loadAll() {
                void (async () => {
                    while (chapterNo > 0) {
                        chapterNo = getNextChapterNo(chapterNo, projectDetails);
                        if (chapterNo > 0) {
                            await loadChapter(chapterNo, projectDetails);
                        } else {
                            break;
                        }
                    }
                    const lazyLoadImage = document.querySelector(
                        "img[loading='lazy']"
                    );
                    if (lazyLoadImage) {
                        lazyLoadImage.loading = "eager";
                    }
                    cloneEl.removeEventListener("click", loadAll);
                    cloneEl.remove();
                })();
            });
            if (getNextChapterNo(chapterNo, projectDetails) > -1) {
                const parentEl = document.querySelector(
                    ".layout-helper.svelte-ixpqjn"
                );
                if (parentEl) {
                    parentEl.insertBefore(cloneEl, parentEl.firstChild);
                }
            }
        }
    }
    function changeUrl(chapter) {
        const splitUrl = window.location.href.split("/");
        const chapterStr = chapter.toString();
        splitUrl[splitUrl.length - 1] = chapterStr;
        const newUrl = splitUrl.join("/");
        if (window.location.href !== newUrl) {
            // change title to chapter
            const titleEl = document.querySelector("title");
            if (titleEl) {
                // get text between "." and " "
                const oldChapter = getTextBtw(titleEl.innerText, ".", " ");
                // replace oldChapter to chapter
                titleEl.innerText = titleEl.innerText.replace(
                    oldChapter,
                    chapterStr
                );
            }
            window.history.replaceState({}, "", newUrl);
        }
        document.querySelectorAll("select").forEach((el) => {
            el.value = chapterStr;
        });
    }
    function addEventChangeSize() {
        const els = document.querySelectorAll(".size-range li.svelte-fv9tk4");
        for (let i = 0; i < els.length; i++) {
            const el = els[i];
            el.addEventListener("click", function () {
                const size = window.innerHeight;
                const images = document.querySelectorAll("#mangaImages img");
                if (images[0]?.classList?.contains(`display${i}`)) return;
                let imageBeforeChangePositionEl;
                // get element near current position
                for (const image of images) {
                    if (image.getBoundingClientRect().top + size > 0) {
                        imageBeforeChangePositionEl = image;
                        break;
                    }
                }
                images.forEach((imageEl) => {
                    removeDisplayActiveClass(imageEl);
                    imageEl.classList.add(`display${i}`);
                });
                // scroll to image near pervious position
                if (imageBeforeChangePositionEl) {
                    window.scrollTo({
                        top:
                            imageBeforeChangePositionEl.getBoundingClientRect()
                                .top + window.scrollY,
                        behavior: "smooth",
                    });
                }
            });
        }
    }
    function getTextBtw(str, str1, str2) {
        const index1 = str.indexOf(str1);
        const index2 = str.indexOf(str2);
        return str.substring(index1 + str1.length, index2);
    }
    ready(() => {
        void (async () => {
            addEventChangeSize();
            const projectDetails = await getProjectDetailFull(projectId);
            while (!(await checkLoadState()));
            prototypeEl = document
                .querySelector(mangaPageSelector)
                ?.cloneNode(true);
            createElementPage();
            closeBtn();
            loadAllChapterBtn(projectDetails);
            onloadImages();
            host = new URL(
                document.querySelector(
                    `${mangaPageSelector} img:not(#mangaImages ${mangaPageSelector})`
                )?.src || "https://fs.nekopost.net/"
            ).origin;
            await loadChapter(chapterNo.toString(), projectDetails);
            clearPage();
            if (getNextChapterNo(chapterNo, projectDetails) > -1) {
                addScrollEvent(projectDetails);
            }
        })();
    });
})();
