// ==UserScript==
// @name         Nekopost Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add infinite scroll functionality to Nekopost project pages
// @author       You
// @include      https://www.nekopost.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Configuration constants
    const CONFIG = {
        LOAD_MORE_BUTTON_SELECTOR:
            '.btn.mx-auto.flex.w-40.justify-center.rounded-full.border.border-gray-500.bg-transparent.text-white.hover\\:bg-gray-700'
    };

    /**
     * Check if current URL matches target paths using regex for precise matching
     */
    function isValidUrl(): boolean {
        const url = window.location.href;
        // Regex pattern to match URLs like https://www.nekopost.net/manga/*, etc.
        const URL_PATTERN = /^https:\/\/www\.nekopost\.net\/(manga|project|comic|novel|original_novel)(\/.*)?$/;
        return URL_PATTERN.test(url);
    }

    /**
     * Find the "Load More" button in the DOM
     */
    function findLoadMoreButton(): HTMLButtonElement | null {
        return document.querySelector(CONFIG.LOAD_MORE_BUTTON_SELECTOR) as HTMLButtonElement | null;
    }

    /**
     * Load more content by clicking the button
     */
    function loadMoreContent(): void {
        const button = findLoadMoreButton();
        if (button) {
            button.click();
            // Delay 100ms as requested
            setTimeout(() => {
                // Check again after delay
                checkAndLoad();
            }, 100);
        }
    }

    /**
     * Debounce function to limit how often a function can be called
     */
    function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout>;
        return function executedFunction(...args: Parameters<T>) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    /**
     * Check if element is almost in viewport (within 200px)
     */
    function isElementAlmostInViewport(element: Element): boolean {
        const rect = element.getBoundingClientRect();
        const threshold = 200; // Start loading when button is 200px away from viewport
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    }

    /**
     * Check for load more button and click if found and almost visible
     */
    function checkAndLoad(): void {
        if (!isValidUrl()) {
            return;
        }

        const button = findLoadMoreButton();
        if (button && isElementAlmostInViewport(button)) {
            loadMoreContent();
        }
    }

    // Debounced scroll handler
    const debouncedCheckAndLoad = debounce(checkAndLoad, 100);

    /**
     * Initialize the script
     */
    function init(): void {
        // Check when DOM is ready and on scroll
        checkAndLoad();
        window.addEventListener('scroll', debouncedCheckAndLoad);
    }

    // Start the script when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
