async function hideTodos() {
    const setting = (await browser.storage.local.get({ accent: '1F6199' })).accent;
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`:root { --ic-link-color: #${setting} !important; }`);
}

hideTodos();
