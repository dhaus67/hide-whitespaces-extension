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
            window.location.href = currentUrl.toString();
          }
        },
      });
    }
  }
}

browser.tabs.onUpdated.addListener(addWhitespaceParameter);
