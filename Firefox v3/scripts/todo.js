// TODO: Need to fix revealing TODOs on dashboard page.
async function hideTodos() {
    const setting = (await browser.storage.local.get({ todosHidden: false })).todosHidden;
    if (!setting) document.querySelectorAll('.Sidebar__TodoListContainer').forEach(el => el.style.display = 'block');
}

hideTodos();
