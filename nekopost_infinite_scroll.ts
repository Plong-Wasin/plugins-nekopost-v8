interface RootProjectInfo {
    code: number;
    desc: string;
    projectInfo: ProjectInfo;
    listCate: ListCate[];
    listChapter: ListChapter[];
    listProvider: ListProvider[];
    listMedia?: unknown;
}
interface ListProvider {
    userId: string;
    displayName: string;
}

interface ListChapter {
    chapterId: string;
    chapterNo: string;
    chapterName: string;
    status: string;
    publishDate: string;
    createDate: string;
    view: string;
    ownerId: string;
    providerName: string;
}

interface ListCate {
    cateCode: string;
    cateName: string;
    cateLink: string;
}

interface ProjectInfo {
    projectId: string;
    projectName: string;
    aliasName: string;
    website: string;
    author: string;
    authorName: string;
    artist: string;
    artistName: string;
    info: string;
    status: string;
    flgMature: string;
    flgIntense: string;
    flgViolent: string;
    flgGlue: string;
    flgReligion: string;
    mainCategory: string;
    goingType: string;
    projectType: string;
    readerGroup: string;
    releaseDate: string;
    updateDate: string;
    views: string;
}

interface RootChapterInfo {
    projectId: string;
    chapterId: number;
    chapterNo: string;
    pageItem: PageItem[];
    pageCount: number;
}

interface PageItem {
    pageNo: number;
    pageName?: string;
    fileName?: string;
    width: number;
    height: number;
}

(() => {
    let host = "";
    let prototypeEl: HTMLElement | undefined | Node;
    const splitUrl = window.location.pathname.split("/");
    const projectId: string | number = splitUrl[splitUrl.length - 2];
    let chapterNo: string | number = parseFloat(splitUrl[splitUrl.length - 1]);
    const mangaPageSelector = ".w-full.border-0.border-white .mb-10";
    function ready(fn: () => void): void {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function sleep(ms: number): Promise<void> {
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

    async function getProjectDetailFull(
        projectId: string | number
    ): Promise<RootProjectInfo> {
        const response = await fetch(
            `https://uatapi.nekopost.net/frontAPI/getProjectInfo/${projectId}`
        );
        return response.json() as Promise<RootProjectInfo>;
    }

    async function getChapterDetails(
        projectId: string | number,
        chapterId: string | number,
        date: string
    ): Promise<RootChapterInfo> {
        const response = await fetch(
            `${host}/collectManga/${projectId}/${chapterId}/${projectId}_${chapterId}.json?${date}`
        );
        return response.json() as Promise<RootChapterInfo>;
    }

    function clearPage() {
        const els = document.querySelectorAll(
            `${mangaPageSelector}:not(#mangaImages ${mangaPageSelector})`
        );
        els.forEach((el) => {
            if (!document.querySelector("#mangaImages")?.contains(el)) {
                el.remove();
            }
        });
    }

    function removeDisplayActiveClass(el: Element) {
        el.classList.remove("display0", "display1", "display2", "display3");
    }

    function insertPage(
        projectId: string | number,
        chapterId: string | number,
        pageName: string,
        pageNo: string | number,
        totalPages: string | number
    ) {
        const cloneEl = prototypeEl?.cloneNode(true) as HTMLElement;
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
            const pageEl = cloneEl.querySelector<HTMLDivElement>(".text-2xl");
            if (imgEl) {
                imgEl.src = "";
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
        console.log(1);
        return false;
    }

    async function loadChapter(
        chapterNo: string | number,
        projectDetails: RootProjectInfo
    ) {
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
                chapterInfo.pageItem.forEach((page, index) => {
                    insertPage(
                        projectId,
                        chapterId,
                        page.pageName || page.fileName || "",
                        index + 1,
                        totalPages
                    );
                });
                changeUrl(chapterNo);
            }
        }
    }
    function getNextChapterNo(
        currentChapterNo: string | number,
        projectDetails: RootProjectInfo
    ) {
        const chapterList = projectDetails.listChapter;
        // get index from chapter no
        const currentIndex = chapterList.findIndex(
            (chapter) => +chapter.chapterNo === +currentChapterNo
        );
        return currentIndex > 0 ? chapterList[currentIndex - 1].chapterNo : -1;
    }
    function onloadImages() {
        function load() {
            const lazyLoadImages =
                document.querySelectorAll<HTMLImageElement>(
                    "#mangaImages img"
                ) || [];
            const multipleLoad = 3;
            // nodeList to array
            const lazyLoadImagesArray = Array.from(lazyLoadImages);
            // filter uncompleted image elements
            const loadedImages = lazyLoadImagesArray.filter(
                (image) => !image.complete
            );
            const loadedImagesArray = loadedImages.slice(0, multipleLoad);
            loadedImagesArray.forEach((el) => {
                el.loading = "eager";
            });
        }
        function error(this: HTMLImageElement) {
            setTimeout(() => {
                const errorCount = +(this.dataset.errorCount || 0);
                if (errorCount < 3) {
                    // push to error elements if not exist
                    const src = this.src;
                    this.src = src;
                    this.dataset.errorCount = (errorCount + 1).toString();
                }
            }, 1000);
            load.call(this);
        }
        function addEvent(eventName: string, handler: EventListener) {
            const rootEl = document.querySelector("#mangaImages");
            rootEl?.addEventListener(
                eventName,
                function (this: HTMLElement, e) {
                    for (
                        let target = e.target as HTMLImageElement;
                        target && target != this;
                        target = target.parentNode as HTMLImageElement
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
    function addScrollEvent(projectDetails: RootProjectInfo) {
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
        const btnEl: HTMLAnchorElement | null = document.querySelector(
            ".layout-helper.svelte-ixpqjn button"
        );
        const commentEl: HTMLAnchorElement | null = document.querySelector(
            ".layout-helper.svelte-ixpqjn a"
        );
        const cloneEl = btnEl?.cloneNode(true) as HTMLButtonElement;
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
    function getIncompleteImageEls() {
        const imageEls =
            document.querySelectorAll<HTMLImageElement>("#mangaImages img");
        const imageElsArray = Array.from(imageEls);
        return imageElsArray.filter((el) => !el.complete);
    }
    function loadAllChapterBtn(projectDetails: RootProjectInfo) {
        const btnEl: HTMLAnchorElement | null = document.querySelector(
            ".layout-helper.svelte-ixpqjn button"
        );
        const cloneEl = btnEl?.cloneNode(true) as HTMLButtonElement;
        if (cloneEl) {
            cloneEl.style.backgroundColor = "green";
            cloneEl.innerText = "All";
            cloneEl.style.marginRight = "5px";
            cloneEl.id = "loadAllChapterBtn";
            cloneEl.addEventListener("click", loadAll);
            if (getNextChapterNo(chapterNo, projectDetails) > -1) {
                const parentEl = document.querySelector(
                    ".layout-helper.svelte-ixpqjn"
                );
                parentEl?.insertBefore(cloneEl, parentEl.firstChild);
            }
        }
        function loadAll() {
            void (async () => {
                while (chapterNo > 0) {
                    chapterNo = getNextChapterNo(chapterNo, projectDetails);
                    if (chapterNo > 0) {
                        await loadChapter(chapterNo, projectDetails);
                    } else {
                        break;
                    }
                }
                const imageEls = getIncompleteImageEls();
                if (imageEls) {
                    imageEls[0].loading = "eager";
                }
                cloneEl.removeEventListener("click", loadAll);
                cloneEl.remove();
            })();
        }
    }

    function changeUrl(chapter: string | number) {
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
    function getTextBtw(str: string, str1: string, str2: string) {
        const index1 = str.indexOf(str1);
        const index2 = str.indexOf(str2);
        return str.substring(index1 + str1.length, index2);
    }
    ready(() => {
        void (async () => {
            // addEventChangeSize();
            const projectDetails = await getProjectDetailFull(projectId);
            while (!(await checkLoadState()));
            prototypeEl = document
                .querySelector(mangaPageSelector)
                ?.cloneNode(true);
            createElementPage();
            // closeBtn();
            // loadAllChapterBtn(projectDetails);
            onloadImages();
            host = new URL(
                document.querySelector<HTMLImageElement>(
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
