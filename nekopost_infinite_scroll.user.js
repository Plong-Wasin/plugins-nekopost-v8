// ==UserScript==
// @name         nekopost_infinite_scroll
// @namespace    https://github.com/Plong-Wasin
// @version      0.4
// @description  nekopost-next-chapter
// @author       Plong-Wasin
// @updateURL    https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_infinite_scroll.meta.js
// @downloadURL  https://github.com/Plong-Wasin/plugins-nekopost-v8/raw/main/nekopost_infinite_scroll.user.js
// @match        https://www.nekopost.net/manga/*/*
// @grant        window.close
// ==/UserScript==
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

function currentDate() {
    const d = new Date();
    return (
        d.getFullYear() +
        (parseInt(d.getMonth()) + 1 >= 10 ?
            parseInt(d.getMonth()) + 1 :
            "0" + (parseInt(d.getMonth()) + 1)) +
        (parseInt(d.getDate()) >= 10 ?
            parseInt(d.getDate()) :
            "0" + parseInt(d.getDate())) +
        (parseInt(d.getHours()) >= 10 ?
            parseInt(d.getHours()) :
            "0" + parseInt(d.getHours())) +
        (parseInt(d.getMinutes()) >= 10 ?
            parseInt(d.getMinutes()) :
            "0" + parseInt(d.getMinutes()))
    );
}

async function getProjectDetailFull(projectId) {
    let response = await fetch(
        `https://tuner.nekopost.net/ApiTest/getProjectDetailFull/${projectId}`
    );
    return await response.json();
}

async function getChapterDetails(projectId, chapterId, date) {
    let response = await fetch(
        `https://fs.nekopost.net/collectManga/${projectId}/${chapterId}/${projectId}_${chapterId}.json?${date}`
    );
    return await response.json();
}

function clearPage() {
    document
        .querySelectorAll(
            ".t-center.item-content.force-1p.float-left.svelte-1khndz6"
        )
        .forEach((item) => {
            item.outerHTML = "";
        });
}

function insertPage(projectId, chapterId, src, pageNo, totalPages) {
    document.getElementById("page").insertAdjacentHTML(
        "beforeend",
        `<div class="t-center item-content
    force-1p 
   
   float-left
    svelte-1khndz6"><div><article style="border-right: 0.2em solid #000;" class="svelte-14e4tz0"><img loading='lazy' src="https://fs.nekopost.net/collectManga/${projectId}/${chapterId}/${src}" class=" svelte-14e4tz0" style=" max-width: 100%!important;" alt=""></article></div> <span>Page No.${pageNo}/${totalPages}</span></div>`
    );
}

function createElementPage() {
    let newItem = document.createElement("div");
    newItem.id = "page";
    document
        .querySelector('br[style="clear: both;"]')
        .parentNode.insertBefore(
            newItem,
            document.querySelector('br[style="clear: both;"]')
        );
}

async function checkLoadState() {
    await sleep(1000);
    if (document.images.length > 3) {
        return true;
    }
    return false;
}

ready(async() => {
    while (!await checkLoadState());
    closeBtn();
    let splitUrl = window.location.pathname.split('/');
    let scrollCheck,
        nc_chapter_id,
        np_project_id,
        nc_chapter_no,
        projectDetails,
        currentChapterDetails,
        currentChapterIndex;
    np_project_id = splitUrl[splitUrl.length - 2];
    nc_chapter_no = parseFloat(splitUrl[splitUrl.length - 1]);
    clearPage();
    createElementPage();
    projectDetails = await getProjectDetailFull(np_project_id);
    for (let i = 0; i < projectDetails.projectChapterList.length; i++) {
        if (
            projectDetails.projectChapterList[i].nc_chapter_no == nc_chapter_no
        ) {
            nc_chapter_id = projectDetails.projectChapterList[i].nc_chapter_id;
            currentChapterIndex = i;
            break;
        }
    }
    currentChapterDetails = await getChapterDetails(
        np_project_id,
        nc_chapter_id,
        currentDate()
    );
    for (item of currentChapterDetails.pageItem) {
        insertPage(
            np_project_id,
            nc_chapter_id,
            item.fileName,
            item.pageNo,
            currentChapterDetails.pageItem.length
        );
    }
    addEventToImg();
    if (currentChapterIndex > 0)
        window.addEventListener("scroll", async function eventScrollLoadPage() {
            let el = document.querySelectorAll('#page img');
            if (
                window.innerHeight + window.screenY >=
                el[el.length - 1].getBoundingClientRect().top &&
                !scrollCheck && currentChapterIndex > 0
            ) {
                scrollCheck = true;
                currentChapterDetails = await getChapterDetails(
                    np_project_id,
                    projectDetails.projectChapterList[currentChapterIndex - 1].nc_chapter_id,
                    currentDate()
                );
                nc_chapter_id = projectDetails.projectChapterList[currentChapterIndex - 1].nc_chapter_id;
                currentChapterIndex--;
                for (item of currentChapterDetails.pageItem) {
                    insertPage(
                        np_project_id,
                        nc_chapter_id,
                        item.fileName,
                        item.pageNo,
                        currentChapterDetails.pageItem.length
                    );
                }
                addEventToImg();
                changeChapter(projectDetails.projectChapterList[currentChapterIndex].nc_chapter_no);
                scrollCheck = false;
                if (currentChapterIndex == 0) {
                    window.removeEventListener('scroll', eventScrollLoadPage)
                }
            }
        });
});

function closeBtn() {
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
}

function addEventToImg() {
    let el = document.querySelectorAll('#page img');
    for (let i = 0; i < el.length; i++) {
        if (i < el.length - 1) {
            el[i].addEventListener('load', e => {
                el[i + 1].loading = 'auto';
            })
        }
    }
}

function changeChapter(chapter) {
    let splitUrl = window.location.href.split('/');
    splitUrl[splitUrl.length - 1] = chapter;
    let newUrl = splitUrl.join('/');
    window.history.pushState({}, '', newUrl);
    document.querySelectorAll('select').forEach(el => { el.value = chapter });
}