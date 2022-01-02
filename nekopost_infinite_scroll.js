"use strict";
(() => {
    let prototypeEl;
    const mangaPageSelector = ".t-center.item-content";
    function ready(fn) {
        if (document.readyState != "loading") {
            fn();
        }
        else {
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
        const response = await fetch(`https://uatapi.nekopost.net/frontAPI/getProjectInfo/${projectId}`);
        return response.json();
    }
    async function getChapterDetails(projectId, chapterId, date) {
        const response = await fetch(`https://fs.nekopost.net/collectManga/${projectId}/${chapterId}/${projectId}_${chapterId}.json?${date}`);
        return response.json();
    }
    function clearPage() {
        const els = document.querySelectorAll(mangaPageSelector);
        els.forEach((el) => {
            el.remove();
        });
    }
    function removeDisplayActiveClass(el) {
        el.classList.remove("display0");
        el.classList.remove("display1");
        el.classList.remove("display2");
        el.classList.remove("display3");
    }
    function insertPage(projectId, chapterId, pageName, pageNo, totalPages) {
        const cloneEl = prototypeEl?.cloneNode(true);
        const appendEl = document.querySelector("#mangaImages");
        const sizeEls = document.querySelectorAll(".size-range li.svelte-fv9tk4");
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
                imgEl.src = `https://fs.nekopost.net/collectManga/${projectId}/${chapterId}/${pageName}`;
                imgEl.loading = "lazy";
                removeDisplayActiveClass(imgEl);
                imgEl.classList.add(`display${displayActive}`);
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
    ready(() => {
        void (async () => {
            addEventChangeSize();
            const splitUrl = window.location.pathname.split("/");
            const projectId = splitUrl[splitUrl.length - 2];
            const chapterNo = parseFloat(splitUrl[splitUrl.length - 1]);
            const projectDetails = await getProjectDetailFull(projectId);
            let scrollCheck = false, chapterId = 0, currentChapterDetails, currentChapterIndex = 0;
            for (let i = 0; i < projectDetails.listChapter.length; i++) {
                if (+projectDetails.listChapter[i].chapterNo === chapterNo) {
                    chapterId = projectDetails.listChapter[i].chapterId;
                    currentChapterIndex = i;
                    break;
                }
            }
            const promiseCurrentChapterDetails = getChapterDetails(projectId, chapterId, currentDate());
            while (!(await checkLoadState()))
                ;
            prototypeEl = document
                .querySelector(mangaPageSelector)
                ?.cloneNode(true);
            createElementPage();
            closeBtn();
            clearPage();
            currentChapterDetails = await promiseCurrentChapterDetails;
            currentChapterDetails.pageItem.sort((a, b) => a.pageNo - b.pageNo);
            for (const item of currentChapterDetails.pageItem) {
                insertPage(projectId, chapterId, item.pageName || item.fileName || "", item.pageNo, currentChapterDetails.pageItem.length);
            }
            addEventToImg();
            if (currentChapterIndex > 0) {
                window.addEventListener("scroll", function eventScrollLoadPage() {
                    void (async () => {
                        const el = document.querySelectorAll("#mangaImages img");
                        if (window.innerHeight + window.screenY >=
                            el[el.length - 1].getBoundingClientRect()
                                .top -
                                1000 &&
                            !scrollCheck &&
                            currentChapterIndex > 0) {
                            scrollCheck = true;
                            currentChapterDetails = await getChapterDetails(projectId, projectDetails.listChapter[currentChapterIndex - 1].chapterId, currentDate());
                            chapterId =
                                projectDetails.listChapter[currentChapterIndex - 1].chapterId;
                            currentChapterIndex--;
                            currentChapterDetails.pageItem.sort((a, b) => a.pageNo - b.pageNo);
                            for (const item of currentChapterDetails.pageItem) {
                                insertPage(projectId, chapterId, item.pageName || item.fileName || "", item.pageNo, currentChapterDetails.pageItem.length);
                            }
                            addEventToImg();
                            changeChapter(projectDetails.listChapter[currentChapterIndex].chapterNo);
                            scrollCheck = false;
                            if (currentChapterIndex == 0) {
                                window.removeEventListener("scroll", eventScrollLoadPage);
                            }
                        }
                    })();
                });
            }
        })();
    });
    function closeBtn() {
        const commentEl = document.querySelector(".layout-helper.svelte-ixpqjn a");
        if (commentEl) {
            commentEl.removeAttribute("href");
            const btnEl = commentEl.querySelector("button");
            if (btnEl) {
                btnEl.style.backgroundColor = "red";
                btnEl.innerText = "X";
            }
            commentEl.addEventListener("click", () => {
                window.close();
            });
        }
    }
    function addEventToImg() {
        const els = document.querySelectorAll('#mangaImages img[loading="lazy"]');
        if (els.length > 0) {
            const el = els[els.length - 1];
            el.loading = "auto";
        }
        els.forEach((el, index) => {
            el.addEventListener("load", () => {
                for (let j = 1; j + index < els.length && j <= 3; j++) {
                    const el = els[j + index];
                    el.loading = "auto";
                }
            });
            el.addEventListener("error", function () {
                for (let j = 1; j + index < els.length && j <= 3; j++) {
                    const el = els[j + index];
                    el.loading = "auto";
                }
                setTimeout(() => {
                    const imgSrc = el.src;
                    this.src = imgSrc;
                }, 1000);
            });
        });
    }
    function changeChapter(chapter) {
        const splitUrl = window.location.href.split("/");
        const chapterStr = chapter.toString();
        splitUrl[splitUrl.length - 1] = chapterStr;
        const newUrl = splitUrl.join("/");
        window.history.pushState({}, "", newUrl);
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
                if (images[0]?.classList?.contains(`display${i}`))
                    return;
                let imageBeforeChangePositionEl;
                // get element near current position
                for (const image of images) {
                    if (image.getBoundingClientRect().top + size > 0) {
                        imageBeforeChangePositionEl = image;
                        break;
                    }
                }
                images.forEach((el) => {
                    removeDisplayActiveClass(el);
                    el.classList.add(`display${i}`);
                });
                // scroll to image near pervious position
                if (imageBeforeChangePositionEl) {
                    window.scrollTo({
                        top: imageBeforeChangePositionEl.getBoundingClientRect()
                            .top + window.scrollY,
                        behavior: "smooth",
                    });
                }
            });
        }
    }
})();
