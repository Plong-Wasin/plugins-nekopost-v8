(() => {
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
                color: var(--bs-green);
            }
        `;
        document.head.appendChild(style);
    }

    function loadMore(loadMoreEls: NodeListOf<HTMLButtonElement>) {
        loadMoreEls.forEach((el) => {
            if (
                el.getBoundingClientRect().top - 500 < window.innerHeight &&
                el.getBoundingClientRect().height > 0
            ) {
                el.click();
            }
        });
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
            ".chapter-info:not(.link-to-chapter)"
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
        const loadMoreEls = getElementsByInnerText(
            "More"
        ) as NodeListOf<HTMLButtonElement>;
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

    function addTagAByMutation() {
        const containerEl =
            document.querySelector<HTMLDivElement>(".container");
        if (containerEl) {
            const observer = new MutationObserver(() => {
                if (addTagA().length > 0) {
                    observer.disconnect();
                }
            });
            observer.observe(containerEl, {
                childList: true,
                subtree: true,
            });
        }
    }

    ready(() => {
        createStyle();
        addTagA();
        addTagAByMutation();
        addEventWindowScroll();
        changeMenu();
    });
})();
