async function set_accent_color() {
    let color = await browser.storage.local.get();
    color = color.accent;
    if (color == null) color = "1f6199";
    let style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet.insertRule(`:root { --ic-link-color: #${color} !important; }`);
}


async function add_dashboard_option() {
    // Don't create if already exists (extension reload)
    if (document.getElementById("silk-dashboard-link") != null) return;
    // Menu list item
    let dashboard_item = document.createElement("li");
    dashboard_item.className = "menu-item ic-app-header__menu-list-item";
    dashboard_item.id = "silk-dashboard-link";
    // Link
    let link = document.createElement("a");
    link.className = "ic-app-header__menu-list-link";
    link.role = "button";
    link.href = "/";
    dashboard_item.appendChild(link)
    // Logo image
    let logo = document.createElement("img");
    logo.src = browser.runtime.getURL("icons/icon.svg");
    logo.style.width = "35px";
    logo.style.height = "35px";
    link.appendChild(logo);
    // Tooltip
    let tooltip = document.getElementById("global_nav_dashboard_link");
    link.appendChild(tooltip.querySelector(".menu-item__text").cloneNode(true));
    // Append to menu
    let menu = document.getElementById("menu");
    menu.insertBefore(dashboard_item, menu.firstChild);
}


function get_menu_options() {
    let items = document.getElementsByClassName("ic-app-header__menu-list-item");
    let items_list = {};
    for (let i = 0; i < items.length; i++) {
        let item_name = items[i].textContent.trim();
        // Remove empty entries
        if (item_name == "") continue;
        let id = items[i].id;
        if (id == "") id = items[i].querySelector(".ic-app-header__menu-list-link").id;
        items_list[id] = {
            index: i,
            title: item_name,
            element: items[i],
            hidden: false
        };
    }
    items_list["silk-dashboard-link"].title = "Silk (Dashboard)";
    return items_list;
}


async function customize_page() {
    set_accent_color();
    add_dashboard_option();
    // Retrieve course ID settings from storage
    let settings = await browser.storage.local.get();
    settings = settings.dashboard;
    let items = get_menu_options();
    if (settings == null) settings = items;
    // Check section consistency
    for (const id in items) {
        if (id in settings) {
            items[id].hidden = settings[id].hidden;
        }
        if (items[id].hidden) items[id].element.style.display = "none";
    }
    // Save new settings to storage
    let save = {
        dashboard: items
    };
    for (const id in save.dashboard) {
        delete save.dashboard[id].element;
    }
    browser.storage.local.set(save);
    // Collapse menu if expanded
    let toggle = document.getElementById("primaryNavToggle");
    if (toggle.attributes.title.textContent == "Minimize global navigation") toggle.click();
    document.getElementById("menu").style.display = "flex";
}


async function customize_todos() {
    // Retrieve course ID settings from storage
    let todos_id;
    if (window.location.pathname == "/") {
        todos_id = "todos_dashboard";
    }
    else if (window.location.pathname.includes("/courses")) {
        todos_id = `todos_${window.location.pathname.split("/")[2]}`;
    }
    else return;
    let settings = await browser.storage.local.get();
    settings = settings[todos_id];
    let todo_block = document.getElementsByClassName("Sidebar__TodoListContainer")[0];
    let todos = {
        element: todo_block,
        hidden: false
    };
    if (settings == null) settings = todos;
    // Update hidden with settings
    todos.hidden = settings.hidden;
    if (!todos.hidden) todo_block.style.display = "block";
    // Save new settings to storage
    let save = {};
    save[todos_id] = todos;
    delete save[todos_id].element;
    browser.storage.local.set(save);
}


customize_page();
