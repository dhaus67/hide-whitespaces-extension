importScripts("browser-polyfill.min.js");

function addWhitespaceParameter(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    const url = new URL(tab.url);

    if (
      url.hostname === "github.com" &&
      url.pathname.match(/.*\/pull\/\d+\/files/) &&
      (!url.searchParams.has("w") || url.searchParams.get("w") !== "1")
    ) {
      browser.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          const currentUrl = new URL(window.location.href);
          if (
            !currentUrl.searchParams.has("w") ||
            currentUrl.searchParams.get("w") !== "1"
          ) {
            currentUrl.searchParams.set("w", "1");
            history.replaceState(null, "", currentUrl.toString());

            // Trigger a content refresh by clicking the "Hide whitespace changes" button.
            // Only changing the history state isn't triggering a content refresh on
            // GitHub's side.
            const hideWhitespaceButton = document.querySelector(
              'button[data-hotkey="w"]',
            );
            if (hideWhitespaceButton) {
              hideWhitespaceButton.click();
              hideWhitespaceButton.click(); // Click twice to toggle on if it was off
            } else {
              // If button not found, fall back to reloading the page
              window.location.reload();
            }
          }
        },
      });
    }
  }
}

browser.tabs.onUpdated.addListener(addWhitespaceParameter);
