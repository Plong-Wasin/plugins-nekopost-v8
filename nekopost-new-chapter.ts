(() => {
    let isPageLoading = true;
    function ready(fn: () => void): void {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    // get chapter from string
    // example: Ch.5.5 - special chapter => 5.5
    // example: Ch.6.5,6,7 - special chapter => 6
    function getChapter(str: string): number {
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
        const loadMoreButton = document.querySelector<HTMLButtonElement>(
            ".w-full.rounded-md.border-b-2"
        );
        if (loadMoreButton) {
            if (
                loadMoreButton.getBoundingClientRect().top - 500 <
                    window.innerHeight &&
                loadMoreButton.getBoundingClientRect().height > 0 &&
                !isPageLoading
            ) {
                isPageLoading = true;
                loadMoreButton.click();
            }
        }
    }

    function getElementsByInnerText(
        text: string,
        selector = "*"
    ): NodeListOf<Element> {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        const filteredElements: unknown = Array.from(elements).filter((el) => {
            return el.innerText === text;
        });
        return filteredElements as NodeListOf<Element>;
    }

    function addTagA() {
        const chapterEls = document.querySelectorAll<HTMLSpanElement>(
            ".cursor-pointer.text-white-900.text-xs.leading-5.text-ellipsis.overflow-hidden.h-4:not(.link-to-chapter)"
        );
        chapterEls.forEach((el) => {
            const originalText = el.innerText;
            const chapter = getChapter(el.innerText);
            const projectUrl: string = el.closest("a")?.href || "";
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

    function addTagAByMutation() {
        const containerEl =
            document.querySelector<HTMLDivElement>(".svelte-rn2hpa");
        if (containerEl) {
            const observer = new MutationObserver(() => {
                if (addTagA().length) {
                    isPageLoading = false;
                }
                loadMore();
            });
            observer.observe(containerEl, {
                childList: true,
                subtree: true,
            });
        }
    }

    ready(() => {
        createStyle();
        addTagAByMutation();
        addEventWindowScroll();
        changeMenu();
    });
})();
