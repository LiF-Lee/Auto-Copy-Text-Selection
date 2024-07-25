chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ toggle: false });
});