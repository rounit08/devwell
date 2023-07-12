let startTime;
let intervalId;
let panelWindowId;

chrome.runtime.onStartup.addListener(() => {
  startTime = Date.now();
});

chrome.runtime.onInstalled.addListener(() => {
  startPopupTimer();
});

function startPopupTimer() {
  intervalId = setInterval(() => {
    showPopup();
  }, 90 * 60 * 1000);
}

function stopPopupTimer() {
  clearInterval(intervalId);
}

function showPopup() {
  if (panelWindowId) {
    chrome.windows.update(panelWindowId, { focused: true });
  } else {
    chrome.windows.create(
      {
        url: "devwell.html",
        type: "panel",
        width: 340,
        height: 560,
      },
      (window) => {
        panelWindowId = window.id;
      }
    );
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getStartTime") {
    sendResponse({ startTime: startTime });
  }
  if (message === "popupClosed") {
    startPopupTimer();
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === panelWindowId) {
    panelWindowId = null;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  startTime = Date.now();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getStartTime") {
    sendResponse({ startTime: startTime });
  }
});
