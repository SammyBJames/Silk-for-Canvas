function loadSection(header, items) {
    const h1 = document.createElement('h1');
    h1.innerText = header;
    document.body.append(h1);

    const list = document.createElement('ul');
    list.className = 'item-list';

    for (const item of items) {
        const listItem = document.createElement('li');
        listItem.className = 'item';
        for (const subitem of item) listItem.appendChild(subitem);
        list.appendChild(listItem);
    }

    document.body.append(list);
}

async function loadSectionsCustomization(tab) {
    const courseId = new URL(tab.url).pathname.split("/")[2];
    const query = {};
    query[`available_${courseId}`] = [];
    query[`hidden_${courseId}`] = [];
    let sections = await chrome.storage.sync.get(query);

    // Show results in extension popup
    const itemHeader = document.createElement('span');
    itemHeader.className = 'header';
    itemHeader.textContent = 'Section Name';
    const toggleHeader = document.createElement('span');
    toggleHeader.className = 'header';
    toggleHeader.textContent = 'Enabled';

    let sectionToggles = [[
        itemHeader,
        toggleHeader
    ]];

    for (const item of sections[`available_${courseId}`]) {
        const label = document.createElement('label');

        const title = document.createElement('span');
        title.textContent = item;
        label.appendChild(title);

        const switchEl = document.createElement('span');
        switchEl.className = 'switch';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        if (!sections[`hidden_${courseId}`].includes(item)) toggle.checked = 'true';
        toggle.addEventListener('change', async () => {
            const query = {};
            query[`hidden_${courseId}`] = [];
            let hiddenItems = (await chrome.storage.sync.get(query))[`hidden_${courseId}`];
            if (toggle.checked && hiddenItems.includes(item)) hiddenItems = hiddenItems.filter(el => el !== item);
            else if (!toggle.checked && !hiddenItems.includes(item)) hiddenItems.push(item);
            else return;
            query[`hidden_${courseId}`] = hiddenItems;
            await chrome.storage.sync.set(query);
            chrome.tabs.reload(tab.id);
        });
        switchEl.appendChild(toggle);

        const slider = document.createElement('span');
        slider.className = 'slider';
        switchEl.appendChild(slider);

        label.appendChild(switchEl);
        sectionToggles.push([label]);
    }

    loadSection('Course Sections', sectionToggles);
}

async function loadNavCustomization(tab) {
    let navItems = await chrome.storage.sync.get({
        availableNav: [],
        hiddenNav: []
    });

    // Show results in extension popup
    const itemHeader = document.createElement('span');
    itemHeader.className = 'header';
    itemHeader.textContent = 'Item Name';
    const toggleHeader = document.createElement('span');
    toggleHeader.className = 'header';
    toggleHeader.textContent = 'Enabled';

    let navToggles = [[
        itemHeader,
        toggleHeader
    ]];

    for (const item of navItems.availableNav) {
        const label = document.createElement('label');

        const title = document.createElement('span');
        title.textContent = item;
        label.appendChild(title);

        const switchEl = document.createElement('span');
        switchEl.className = 'switch';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        if (!navItems.hiddenNav.includes(item)) toggle.checked = 'true';
        toggle.addEventListener('change', async () => {
            let hiddenItems = (await chrome.storage.sync.get({ hiddenNav: [] })).hiddenNav;
            if (toggle.checked && hiddenItems.includes(item)) hiddenItems = hiddenItems.filter(el => el !== item);
            else if (!toggle.checked && !hiddenItems.includes(item)) hiddenItems.push(item);
            else return;
            await chrome.storage.sync.set({ hiddenNav: hiddenItems });
            chrome.tabs.reload(tab.id);
        });
        switchEl.appendChild(toggle);

        const slider = document.createElement('span');
        slider.className = 'slider';
        switchEl.appendChild(slider);

        label.appendChild(switchEl);
        navToggles.push([label]);
    }

    loadSection('Navigation', navToggles);
}

async function loadTodoCustomization(tab) {
    let setting = (await chrome.storage.sync.get({ todosHidden: false })).todosHidden;

    const label = document.createElement('label');

    const title = document.createElement('span');
    title.textContent = 'Show TODOs';
    label.appendChild(title);

    const switchEl = document.createElement('span');
    switchEl.className = 'switch';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    if (!setting) toggle.checked = 'true';
    toggle.addEventListener('change', async () => {
        let todosHidden = (await chrome.storage.sync.get({ todosHidden: false })).todosHidden;
        if (toggle.checked && todosHidden) todosHidden = false;
        else if (!toggle.checked && !todosHidden) todosHidden = true;
        else return;
        await chrome.storage.sync.set({ todosHidden: todosHidden });
        chrome.tabs.reload(tab.id);
    });
    switchEl.appendChild(toggle);

    const slider = document.createElement('span');
    slider.className = 'slider';
    switchEl.appendChild(slider);

    label.appendChild(switchEl);

    loadSection('TODOs', [[label]]);
}

function getColorPicker(name, color, revert, callback) {
    const label = document.createElement('span');
    label.textContent = name;

    const inputContainer = document.createElement('div');
    inputContainer.className = 'accent-input';

    const prefix = document.createElement('span');
    prefix.textContent = '#';
    inputContainer.appendChild(prefix);

    const input = document.createElement('input');
    input.id = 'accent-box';
    input.className = 'input-box';
    input.type = 'text';
    input.value = color;
    const updateColor = async () => {
        const newColor = input.value.trim().toUpperCase();
        if (/^[0-9A-F]{6}$/i.test(newColor)) callback(newColor);
    }
    input.addEventListener('input', updateColor);
    inputContainer.appendChild(input);

    const resetButton = document.createElement('img');
    resetButton.src = 'reset.svg';
    resetButton.addEventListener('click', async () => {
        input.value = revert;
        await updateColor();
    });
    inputContainer.appendChild(resetButton);
    return [label, inputContainer];
}

async function loadColorCustomization(tab) {
    const defaults = {
        accent: '1F6199',
        primaryColor1: '10B1E7',
        primaryColor2: '5852A3',
        primaryColor3: 'B72F2B',
        backgroundColor: '252525'
    };
    let setting = await chrome.storage.sync.get(defaults);

    const updateColor = async (colorName, defaultColor, color) => {
        const query = {};
        query[`${colorName}`] = defaultColor;
        let currentSetting = await chrome.storage.sync.get(query);
        if (color != currentSetting[`${colorName}`]) {
            query[`${colorName}`] = color;
            await chrome.storage.sync.set(query);
            chrome.tabs.reload(tab.id);
        }
    };
    const accentInput = getColorPicker('Accent Color', setting.accent, defaults.accent, color => updateColor('accent', defaults.accent, color));
    const color1Input = getColorPicker('Primary Color 1', setting.primaryColor1, defaults.primaryColor1, color => updateColor('primaryColor1', defaults.primaryColor1, color));
    const color2Input = getColorPicker('Primary Color 2', setting.primaryColor2, defaults.primaryColor2, color => updateColor('primaryColor2', defaults.primaryColor2, color));
    const color3Input = getColorPicker('Primary Color 3', setting.primaryColor3, defaults.primaryColor3, color => updateColor('primaryColor3', defaults.primaryColor3, color));
    const backgroundInput = getColorPicker('Background Color (Menu, Buttons)', setting.backgroundColor, defaults.backgroundColor, color => updateColor('backgroundColor', defaults.backgroundColor, color));

    loadSection('Colors', [accentInput, color1Input, color2Input, color3Input, backgroundInput]);
}

async function loadPopup() {
    let tab = (await chrome.tabs.query({ currentWindow: true, active: true }))[0];
    let url = new URL(tab.url);
    if (!url.hostname.includes('.instructure.com') || url.hostname === 'www.instructure.com') {
        // Disabled page
        const redirectMsg = document.createElement('span');
        redirectMsg.textContent = 'Go to Canvas to show options.';
        loadSection('Silk for Canvas', [[redirectMsg]])
        return;
    }
    // Load sections if applicable
    if (url.pathname.includes('/courses')) await loadSectionsCustomization(tab);
    // Load page settings
    await loadNavCustomization(tab);
    // Load TODOs settings
    await loadTodoCustomization(tab);
    // load_custom_nav_customization(tab);
    await loadColorCustomization(tab);
}

loadPopup();
