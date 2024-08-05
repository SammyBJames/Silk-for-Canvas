async function customizeAccent() {
    const setting = (await chrome.storage.sync.get({ accent: '1F6199' })).accent;
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`:root { --ic-link-color: #${setting} !important; }`);
}

customizeAccent();
