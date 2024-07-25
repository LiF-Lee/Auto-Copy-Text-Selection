chrome.storage.sync.get('toggle', (data) => {
    let isEnabled = data.toggle !== undefined ? data.toggle : false;
    let lastRightClickTime = 0;

    function copyToClipboard() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }

    function pasteFromClipboard() {
        navigator.clipboard.readText().then((text) => {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
                activeElement.selectionStart = activeElement.selectionEnd = start + text.length;

                const event = new Event('input', { bubbles: true });
                activeElement.dispatchEvent(event);
            } else {
                document.execCommand('insertText', false, text);
            }
        }).catch(err => {
            console.error('Failed to read clipboard: ', err);
        });
    }

    function addSelectionStyle() {
        let style = document.getElementById('selection-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'selection-style';
            document.head.appendChild(style);
        }
        style.innerHTML = `::selection { color: black; background: yellow; }`;
    }

    function removeSelectionStyle() {
        const style = document.getElementById('selection-style');
        if (style) {
            style.remove();
        }
    }

    if (isEnabled) {
        addSelectionStyle();
    }

    document.addEventListener('mouseup', () => {
        if (isEnabled) {
            addSelectionStyle();
            copyToClipboard();
        } else {
            removeSelectionStyle();
        }
    });

    document.addEventListener('contextmenu', (event) => {
        if (isEnabled) {
            const currentTime = new Date().getTime();
            if (currentTime - lastRightClickTime < 300) {
                event.preventDefault();
                pasteFromClipboard();
            }
            lastRightClickTime = currentTime;
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.toggle !== undefined) {
            isEnabled = changes.toggle.newValue;
            if (isEnabled) {
                addSelectionStyle();
            } else {
                removeSelectionStyle();
            }
        }
    });
});