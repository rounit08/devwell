

let startTime;
let intervalId;
let panelWindowId;

function startPopupTimer() {
  intervalId = setInterval(showPopup, 90 * 60 * 1000);
}

function stopPopupTimer() {
  clearInterval(intervalId);
}


function showPopup() {
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


chrome.runtime.onStartup.addListener(() => {
  startTime = Date.now();
});

chrome.runtime.onInstalled.addListener(() => {
  startPopupTimer();
});

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

// Periodically update the active time
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { updateActiveTime: true });
    });
  });
}, 1000);
