// ==UserScript==
// @name         Nekopost Href Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify href attributes for nekopost project links with SPA support
// @author       You
// @match        https://www.nekopost.net/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Add CSS for visited links with specific class
    GM_addStyle(`
        a.nekopost-chapter-link:visited {
            color: #6b7280 !important;
        }
        a.nekopost-chapter-link:visited > div:first-child {
            color: #6b7280 !important;
        }
    `);

    // Regex pattern to match URLs like https://www.nekopost.net/project/15672/87 or https://www.nekopost.net/project/15672/87.5
    const URL_PATTERN = /^https:\/\/www\.nekopost\.net\/project\/\d+\/\d+(?:\.\d+)?\/?$/;

    // Debounce function to limit how often a function can be called
    function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout>;
        return function executedFunction(...args: Parameters<T>) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Function to modify a single link
    function modifyLink(link: HTMLAnchorElement): void {
        const href = link.getAttribute('href');
        if (href && URL_PATTERN.test(href)) {
            // Extract the last part of the URL (after the last slash)
            const urlParts = href.split('/').filter((part) => part !== ''); // Remove empty parts
            const lastPart = urlParts[urlParts.length - 1];

            // Set new href to "./" + lastPart
            link.setAttribute('href', `./${lastPart}`);

            // Add the CSS class for visited styling
            link.classList.add('nekopost-chapter-link');
        }
    }

    // Function to process all existing links
    function processExistingLinks(): void {
        const links = document.querySelectorAll('a[target="_self"][href^="https://www.nekopost.net/project/"]');
        links.forEach((link) => modifyLink(link as HTMLAnchorElement));
    }

    // Function to handle new nodes added to the DOM
    const handleMutations = debounce((mutations: MutationRecord[]): void => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Check if the added node is an element
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;

                    // If the element itself is a matching link
                    if (
                        element.tagName === 'A' &&
                        element.getAttribute('target') === '_self' &&
                        element.getAttribute('href')?.startsWith('https://www.nekopost.net/project/')
                    ) {
                        modifyLink(element as HTMLAnchorElement);
                    }

                    // Check all descendant links
                    const descendantLinks = element.querySelectorAll(
                        'a[target="_self"][href^="https://www.nekopost.net/project/"]'
                    );
                    descendantLinks.forEach((link) => modifyLink(link as HTMLAnchorElement));
                }
            });
        });
    }, 300);

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(handleMutations);

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true, // observe direct children
        subtree: true // observe all descendants
    });

    // Process existing links when the script first loads
    processExistingLinks();

    // Also process links periodically for SPA navigation (with debounce)
    const debouncedProcessLinks = debounce(processExistingLinks, 500);
    setInterval(debouncedProcessLinks, 2000);
})();
