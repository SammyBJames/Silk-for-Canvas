async function customizeTodos() {
    const setting = (await chrome.storage.sync.get({ todosHidden: false })).todosHidden;
    // Don't reveal TODOs if they should be hidden
    if (setting) return;
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule('.Sidebar__TodoListContainer { display: block !important; }');
}

customizeTodos();
