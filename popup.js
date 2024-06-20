document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');

    chrome.storage.sync.get('toggle', (data) => {
        toggleBtn.textContent = data.toggle ? '✅ Now Running' : '❌ Now Off';
    });

    toggleBtn.addEventListener('click', () => {
        chrome.storage.sync.get('toggle', (data) => {
            const newToggle = !data.toggle;
            chrome.storage.sync.set({ toggle: newToggle });
            toggleBtn.textContent = newToggle ? '✅ Now Running' : '❌ Now Off';
        });
    });
});
  