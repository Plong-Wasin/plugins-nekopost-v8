(() => {
    function ready(fn: () => void): void {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    function delegate(
        el: HTMLElement | Document,
        event: string,
        selector: string,
        fn: (e: Event) => void
    ): void {
        el.addEventListener(event, function (this: HTMLElement, e: Event) {
            if ((e.target as HTMLElement).closest(selector)) {
                fn.call(this, e);
            }
        } as EventListener);
    }

    ready(() => {
        delegate(document, "click", "a", function (this: HTMLElement, e) {
            const target = (e.target as HTMLElement).closest(
                "a"
            ) as HTMLAnchorElement;
            if (target?.closest(".listChapter")) {
                window.location.href = target.href;
            }
        });
    });
})();
