"use strict";
(() => {
    let isPageLoading = true;
    const containerElSelector = "div.grid.grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5.xl\\:grid-cols-6.gap-0.first\\:mt-0.mb-4";
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
                color: rgb(16 185 129);
            }
        `;
        document.head.appendChild(style);
    }
    function loadMore() {
        const loadMoreButton = document.querySelector(".w-full.rounded-md.border-b-2");
        if (loadMoreButton) {
            if (loadMoreButton.getBoundingClientRect().top - 500 < window.innerHeight &&
                loadMoreButton.getBoundingClientRect().height > 0 &&
                !isPageLoading) {
                isPageLoading = true;
                loadMoreButton.click();
            }
        }
    }
    function addTagA() {
        const chapterEls = document.querySelectorAll(".cursor-pointer.text-gray-300.text-xs.xl\\:px-2.leading-5.text-ellipsis.overflow-hidden.h-4:not(.link-to-chapter)");
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
        return chapterEls;
    }
    function addEventWindowScroll() {
        window.addEventListener("scroll", () => {
            loadMore();
        });
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
    function handlePageLoading() {
        // Check if tag A is present and non-empty
        const tagALength = addTagA().length;
        // If tag A is found, page loading is considered completed
        if (tagALength) {
            isPageLoading = false;
        }
        // Load additional content
        loadMore();
    }
    function updateHttpLinksToHttps() {
        // Select all anchor elements with href starting with 'http://'
        const httpLinks = document.querySelectorAll('a[href^="http://"]');
        // Loop through each element and replace 'http://' with 'https://' in the href attribute
        httpLinks.forEach((anchorElement) => {
            anchorElement.href = anchorElement.href.replace("http://", "https://");
        });
    }
    function initializeContentObserver() {
        const containerEl = document.querySelector(containerElSelector);
        if (containerEl) {
            const observer = new MutationObserver(() => {
                handlePageLoading();
                updateHttpLinksToHttps();
            });
            observer.observe(containerEl, {
                childList: true,
                subtree: true,
            });
            handlePageLoading();
            updateHttpLinksToHttps();
        }
    }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Waits until a container element matching the specified selector is found in the document.
     * Resolves when the container element is found.
     */
    async function waitForContainerElement() {
        // Continuously loop until the container element is found
        for (;;) {
            // Attempt to find the container element in the document
            const containerElement = document.querySelector(containerElSelector);
            // If the container element is found, exit the loop
            if (containerElement) {
                break;
            }
            // Wait for a short period before attempting again to avoid CPU usage
            await sleep(100);
        }
    }
    ready(async () => {
        await waitForContainerElement();
        createStyle();
        initializeContentObserver();
        addEventWindowScroll();
        changeMenu();
    });
})();
