(() => {
    function getStrBtw(str, chr1, chr2) {
        if (chr1 == "") { return str.substring(0, str.indexOf(chr2)) }
        return str.substring(str.indexOf(chr1) + 1, str.indexOf(chr2));

    }

    function ready(fn) {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(() => {
        [].forEach.call(document.getElementsByClassName("more"), function(elem) {
            elem.addEventListener("click", () => {
                setTimeout(() => {
                    checkLoadImage();
                }, 500);
                setTimeout(() => {
                    checkLoadImage();
                }, 1000);
                setTimeout(() => {
                    checkLoadImage();
                }, 5000);
            });
        });
        createStyles();
        setTimeout(() => {
            checkLoadImage();
        }, 1000);
        window.addEventListener("scroll", () => {
            if (
                document.getElementsByClassName("more")[0].getBoundingClientRect().top -
                window.innerHeight <
                0 &&
                window.location.href != "https://www.nekopost.net/"
            ) {
                document.getElementsByClassName("more")[0].click();
            }
        });
    });

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function newChapter() {
        for (
            let i = 0; i <
            document.querySelectorAll(
                ".col-6.col-sm-4.col-md-3.col-lg-3.col-xl-2.p-2.svelte-gbfxcs"
            ).length; i++
        ) {
            if (
                document
                .querySelectorAll(".svelte-gbfxcs[style]")[i].innerHTML.search("<a") != -1
            ) {
                continue;
            }
            let tempUrl =
                document.querySelectorAll(
                    ".col-6.col-sm-4.col-md-3.col-lg-3.col-xl-2.p-2.svelte-gbfxcs"
                )[i].children[0].href + "/",
                chapter = getStrBtw(
                    document.querySelectorAll(".svelte-gbfxcs[style]")[i].innerHTML,
                    ".",
                    " "
                );

            if (chapter.search(",") != -1) {
                tempUrl = tempUrl + getStrBtw(chapter, "", ",");
            } else {
                tempUrl = tempUrl + chapter;
            }
            document.querySelectorAll(".svelte-gbfxcs[style]")[
                i
            ].innerHTML = `<a href='${tempUrl}'>${
        document.querySelectorAll(".svelte-gbfxcs[style]")[i].innerHTML
      }</a>`;
        }
    }

    function createStyles() {
        let styles = document.createElement("style");
        styles.innerHTML = `span.svelte-gbfxcs>a:visited{color: rgb(152, 154, 157) !important;}`;
        document.head.appendChild(styles);
    }

    let imgs = document.images,
        len = imgs.length,
        counter = 0;

    function checkLoadImage() {
        (imgs = document.images), (len = imgs.length), (counter = 0);
        [].forEach.call(imgs, function(img) {
            if (img.complete) incrementCounter();
            else {
                img.addEventListener("load", incrementCounter, false);
                img.addEventListener("error", incrementCounter, false);
            }
        });
    }

    function incrementCounter() {
        counter++;
        if (counter === len) {
            newChapter();
        }
    }
})();