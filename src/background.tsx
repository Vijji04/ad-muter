let isMuteOn = false;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "TOGGLE_MUTE") {
    isMuteOn = msg.value;
    console.log("current toggle value:", isMuteOn);
    sendResponse({ status: "ok" });

    // Broadcast to all matching tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.id || !tab.url || !/^https?:/.test(tab.url)) return;
        const isSupported =
          tab.url.includes("sonyliv.com") || tab.url.includes("jiocinema.com");
        if (!isSupported) return;

        chrome.tabs.update(tab.id, {
          muted: !isMuteOn ? false : tab.mutedInfo?.muted,
        });
        chrome.tabs.sendMessage(
          tab.id,
          { type: "UPDATE_MUTE", value: isMuteOn },
          () => {
            void chrome.runtime.lastError;
          }
        );
      });
    });
  }

  if (msg.type === "GET_MUTE_STATE") {
    sendResponse({ value: isMuteOn });
  }

  if (msg.type === "DOM_STATE") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      // Mute if ad AND toggle is on, otherwise unmute
      const shouldMute = isMuteOn && msg.isAd;
      chrome.tabs.update(tab.id, { muted: shouldMute });
      console.log("DOM_STATE -> muted:", shouldMute, "isAd:", msg.isAd);
    });
  }
});
