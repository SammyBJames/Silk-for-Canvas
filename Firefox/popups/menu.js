async function load_popup() {
    let tab = (await browser.tabs.query({currentWindow: true, active: true}))[0];
    let url = new URL(tab.url);
    let settings = await browser.storage.local.get();
    if (url.hostname.includes(".instructure.com") && url.hostname != "www.instructure.com") {
        // Load sections if applicable
        if (url.pathname.includes("/courses")) load_sections_customization(tab, settings);
        // Load page settings
        load_nav_customization(tab, settings);
        load_custom_nav_customization(tab, settings);
        load_accent_customization(tab, settings);
    }
    else {
        // Disabled page
        load_list("Silk for Canvas", ["Go to Canvas to show options."])
    }
}


function load_list(header, items) {
    let h1 = document.createElement("h1");
    h1.innerText = header;
    document.body.append(h1);
    let list = document.createElement("ul");
    list.className = "item-list";
    document.body.append(list);
    for (let i = 0; i < items.length; i++) {
        list.innerHTML += `<li class='item'>${items[i]}</li>`;
    }
}


function load_nav_customization(tab, settings) {
    settings = settings.dashboard;
    // Show results in extension popup
    let nav_items = ["<span class='header'>Item Name</span><span class='header'>Enabled</span>"];
    for (let i = 0; i < Object.keys(settings).length; i++) {
        for (const id in settings) {
            if (settings[id].index == i) {
                nav_items.push(`<label><span>${settings[id].title}</span><span class="switch"><input id="${id}" type="checkbox" ${settings[id].hidden ? "" : "checked"}><span class="slider"></span></span></label>`);
                break;
            }
        }
    }
    load_list("Navigation", nav_items);
    for (const id in settings) {
        // Add event listener to checkbox that hides or shows the menu item
        document.getElementById(id).addEventListener("change", () => {
            settings[id].hidden = !settings[id].hidden;
            browser.storage.local.set({ dashboard: settings });
            browser.tabs.reload(tab.id);
        });
    }
}


function load_custom_nav_customization(tab, settings) {
    settings = settings.custom_menu_items;
    if (settings == null) settings = [];
    let menu_list = [`<span>Name</span><input class="input-box" type="text" value=""><span>Link</span><input class="input-box" type="text" value="">`];
    for (let i = 0; i < settings.length; i++) {
        menu_list.unshift(`<span>Name</span><input class="input-box" type="text" value="${settings[i].name}"><span>Link</span><input class="input-box" type="text" value="${settings[i].href}">`);
    }
    load_list("Custom Menu Items", menu_list);
    // let accent_box = document.getElementById("accent-box");
    // TODO Fix this
    // let accent_call = () => {
    //     let val = accent_box.value.trim().toUpperCase();
    //     console.log(/^[0-9A-F]{6}$/i.test(val));
    //     if (/^[0-9A-F]{6}$/i.test(val) && val != settings) {
    //         settings = val;
    //         browser.storage.local.set({ accent: settings });
    //         browser.tabs.reload(tab.id);
    //     }
    // }
    // accent_box.addEventListener("keyup", accent_call);
    // document.getElementById("reset-accent").addEventListener("click", () => {
    //     accent_box.value = "1F6199"
    //     accent_call();
    // });
}


function load_accent_customization(tab, settings) {
    settings = settings.accent;
    if (settings == null) settings = "1F6199";
    load_list("Accent Color", [`<span>Color</span><div class="accent-input"><span>#</span><input class="input-box" id="accent-box" type="text" value="${settings}"><img id="reset-accent" src="reset.svg"></div>`]);
    let accent_box = document.getElementById("accent-box");
    let accent_call = () => {
        let val = accent_box.value.trim().toUpperCase();
        console.log(/^[0-9A-F]{6}$/i.test(val));
        if (/^[0-9A-F]{6}$/i.test(val) && val != settings) {
            settings = val;
            browser.storage.local.set({ accent: settings });
            browser.tabs.reload(tab.id);
        }
    }
    accent_box.addEventListener("keyup", accent_call);
    document.getElementById("reset-accent").addEventListener("click", () => {
        accent_box.value = "1F6199"
        accent_call();
    });
}


function load_sections_customization(tab, settings) {
    let course_id = new URL(tab.url).pathname.split("/")[2];
    settings = settings[`sections_${course_id}`];
    // Show results in extension popup
    let list_items = ["<span class='header'>Section Name</span><span class='header'>Enabled</span>"];
    for (let i = 0; i < Object.keys(settings).length; i++) {
        for (const id in settings) {
            if (settings[id].index == i) {
                list_items.push(`<label><span>${settings[id].title}</span><span class="switch"><input id="${id}" type="checkbox" ${settings[id].hidden ? "" : "checked"}><span class="slider"></span></span></label>`);
                break;
            }
        }
    }
    load_list("Course Sections", list_items);
    for (const id in settings) {
        // Add event listener to checkbox that hides or shows the section
        document.getElementById(id).addEventListener("change", () => {
            settings[id].hidden = !settings[id].hidden;
            let save = {};
            save[`sections_${course_id}`] = settings;
            browser.storage.local.set(save);
            browser.tabs.reload(tab.id);
        });
    }
}


document.body.onload = load_popup;
