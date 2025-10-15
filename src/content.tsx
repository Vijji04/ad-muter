let muteEnabled = false;
console.log("Content script loaded!");
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "UPDATE_MUTE") {
    muteEnabled = msg.value;
  }
});

const detectAds = () => {
  if (!muteEnabled) return;

  const adWrapper = document.querySelector(".ad-wrapper");
  let isAdVisible = false;

  if (adWrapper) {
    // If ad-wrapper exists AND it does NOT have the "ad-layer-hidden" class → ad is playing
    isAdVisible = !adWrapper.classList.contains("ad-layer-hidden");
  }
  try {
    chrome.runtime.sendMessage({ type: "DOM_STATE", isAd: isAdVisible });
  } catch (e) {
    console.log("error", e);
  }
  console.log("DEBUG - isAdVisible:", isAdVisible);
  console.log("Ad is being played", isAdVisible);
};

const observer = new MutationObserver(detectAds);

// Watch entire DOM for changes
observer.observe(document.body, { childList: true, subtree: true });

setInterval(detectAds, 2000);
