(() => {
  let isCheckedShowPageNo = false;
  let isCheckedEagerLoad = false;
  let url: URL = new URL(window.location.href);
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
  /**
   * Processes each page block element by attempting to load any associated images
   * and then toggling the display style of the elements.
   *
   * @param pageBlockElements - A NodeList of HTML div elements representing page blocks.
   */
  async function processPageBlocks(
    pageBlockElements: NodeListOf<HTMLDivElement>
  ) {
    // Convert the NodeList to an array for easier iteration
    const pageBlockArray = Array.from(pageBlockElements);

    // Iterate through each page block element
    for (let i = 0; i < pageBlockArray.length; i++) {
      const blockElement = pageBlockArray[i];
      const imageElement = blockElement.querySelector("img");
      let retryCount = 0;
      const maxRetries = 100;

      // Retry loading the image until it has a source or the max retry limit is reached
      while (retryCount < maxRetries) {
        if (imageElement?.src) {
          break;
        }
        await sleep(10);
        retryCount++;
      }

      // Hide the current page block element
      blockElement.style.display = "none";
    }

    // Display all page block elements
    pageBlockArray.forEach((blockElement) => {
      blockElement.style.display = "flex";
    });
  }
  /**
   * Hides all page block elements by setting their display style to "none".
   *
   * @param pageBlockElements - Collection of HTML div elements representing page blocks.
   */
  function hidePageBlockElements(
    pageBlockElements: NodeListOf<HTMLDivElement>
  ) {
    // Convert the HTMLCollection to an array for easier iteration
    const pageBlockArray = Array.from(pageBlockElements);

    // Hide each page block element
    pageBlockArray.forEach((blockElement) => {
      blockElement.style.display = "none";
    });

    const toggleEls = document.querySelectorAll<HTMLDivElement>(
      ".h-14.toggleTopMenu"
    );

    toggleEls.forEach((el) => {
      el.style.display = "none";
    });
  }
  function settingUI() {
    const tableEl = document.querySelector("table");
    const tbodyEl = tableEl?.querySelector("tbody");
    const showPageNoCheckboxSettingValue =
      localStorage.getItem("showPageNoCheckbox") ?? "true";
    const eagerLoadCheckboxSettingValue =
      localStorage.getItem("eagerLoadCheckbox") ?? "false";

    const showPageNoSettingHtml = `<tr class="border-b"><td valign="top"><span class="font-semibold">Show Page No.</span></td> <td><div><input type="checkbox" id="showPageNoCheckbox" class="cursor-pointer"> <label for="showPageNoCheckbox" class="cursor-pointer">Show</label></div> </td></tr>`;
    const eagerLoadSettingHtml = `<tr class="border-b"><td valign="top"><span class="font-semibold">Eager load</span></td> <td><div><input type="checkbox" id="eagerLoadCheckbox" class="cursor-pointer"> <label for="eagerLoadCheckbox" class="cursor-pointer">Enable</label></div> </td></tr>`;
    tbodyEl?.insertAdjacentHTML("beforeend", showPageNoSettingHtml);
    tbodyEl?.insertAdjacentHTML("beforeend", eagerLoadSettingHtml);
    const showPageNoCheckbox = document.querySelector<HTMLInputElement>(
      "#showPageNoCheckbox"
    );
    const eagerLoadCheckbox =
      document.querySelector<HTMLInputElement>("#eagerLoadCheckbox");
    if (showPageNoCheckboxSettingValue === "true") {
      showPageNoCheckbox?.click();
      isCheckedShowPageNo = true;
    }
    if (eagerLoadCheckboxSettingValue === "true") {
      eagerLoadCheckbox?.click();
      isCheckedEagerLoad = true;
    }

    showPageNoCheckbox?.addEventListener("change", () => {
      if (showPageNoCheckbox.checked) {
        localStorage.setItem("showPageNoCheckbox", "true");
      } else {
        localStorage.setItem("showPageNoCheckbox", "false");
      }
    });
    eagerLoadCheckbox?.addEventListener("change", () => {
      if (eagerLoadCheckbox.checked) {
        localStorage.setItem("eagerLoadCheckbox", "true");
      } else {
        localStorage.setItem("eagerLoadCheckbox", "false");
      }
    });
  }
  function triggerAction() {
    const mangaBlockEl = document.querySelector(
      ".w-full.h-full.bg-gray-100.dark\\:bg-gray-800.min-h-screen"
    );
    const observer = new MutationObserver((mutations, observer) => {
      if ((mangaBlockEl?.querySelectorAll("img")?.length ?? 0) > 2) {
        observer.disconnect();
        settingUI();
        const pageNoBlockEls = document.querySelectorAll<HTMLDivElement>(
          ".lg\\:inline-block.flex.flex-col.items-end"
        );
        const pageBlockEls = document.querySelectorAll<HTMLDivElement>(
          ".flex.flex-col.lg\\:flex-row"
        );
        pageBlockEls.forEach((el) => {
          const imageEl = el.querySelector("img");
          if (imageEl) {
            let retryCount = 0;
            const maxRetries = 3;
            imageEl.onerror = () => {
              if (retryCount < maxRetries) {
                retryCount++;
                imageEl.src = imageEl.src;
              } else {
                imageEl.onerror = null;
              }
            };
          }
        });
        if (!isCheckedShowPageNo) {
          hidePageBlockElements(pageNoBlockEls);
        }
        if (isCheckedEagerLoad) {
          processPageBlocks(pageBlockEls);
        }
      }
    });
    if (mangaBlockEl) {
      observer.observe(mangaBlockEl, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
  }
  // Function to observe changes in the URL and trigger actions based on certain conditions
  function startUrlObserver() {
    // Helper function to check if the current URL matches the expected manga or comic format
    const isMangaOrComicUrl = (): boolean => {
      return url.pathname.match(/^\/(manga|comic)\/\d+\/\d/) !== null;
    };

    // If the current URL matches the expected format, run the desired action
    if (isMangaOrComicUrl()) {
      triggerAction();
    }

    // Set up an interval to continuously check if the URL has changed
    setInterval(() => {
      // If the URL has changed, update the url object and check again
      if (window.location.pathname !== url.pathname) {
        url = new URL(window.location.href);

        // If the new URL matches the expected format, trigger the action
        if (isMangaOrComicUrl()) {
          triggerAction();
        }
      }
    }, 100); // Check every second
  }

  function observeAndUpdateHttpLinks() {
    // Function to update all HTTP links to HTTPS
    function updateHttpLinks() {
      // Select all anchor elements with href starting with 'http://'
      const httpLinks =
        document.querySelectorAll<HTMLAnchorElement>('a[href^="http://"]');

      // Loop through each element and replace 'http://' with 'https://' in the href attribute
      httpLinks.forEach((anchorElement) => {
        anchorElement.href = anchorElement.href.replace("http://", "https://");
      });
    }

    // Create a MutationObserver to detect changes in the document body
    const httpLinkObserver = new MutationObserver(() => {
      updateHttpLinks(); // Run the update function whenever mutations are detected
    });

    // Start observing the body element for changes to child elements and its subtree
    httpLinkObserver.observe(document.body, {
      childList: true, // Observe direct child elements
      subtree: true, // Also observe changes in descendants
    });

    // Call the function initially to update any existing links
    updateHttpLinks();
  }

  // Call the observer once the page is fully loaded and ready
  ready(() => {
    startUrlObserver();
    observeAndUpdateHttpLinks();
  });
})();
