async function addSilkLogo() {
    // Don't create if already exists (extension reload)
    if (document.getElementById('silk-dashboard-link') != null) return;
    
    // Menu list item
    const menuItem = document.createElement('li');
    menuItem.className = 'menu-item ic-app-header__menu-list-item';
    menuItem.id = 'silk-dashboard-link';

    // Link
    const link = document.createElement('a');
    link.className = 'ic-app-header__menu-list-link';
    link.role = 'button';
    link.href = '/';
    menuItem.appendChild(link)

    // Logo image
    const logo = document.createElement('img');
    logo.src = browser.runtime.getURL('icons/icon.svg');
    logo.style.width = '35px';
    logo.style.height = '35px';
    link.appendChild(logo);

    // Tooltip
    const tooltip = document.getElementById('global_nav_dashboard_link');
    link.appendChild(tooltip.querySelector('.menu-item__text').cloneNode(true));

    // Append to menu
    const menu = document.getElementById('menu');
    menu.insertBefore(menuItem, menu.firstChild);
}

function updateAvailableSections() {
    const items = document.querySelectorAll('.ic-app-header__menu-list-item');

    let navItems = Array.from(items).map(navItem => navItem.textContent.trim());
    navItems = navItems.filter(navItem => navItem !== '');

    navItems[0] = 'Silk (Dashboard)';

    browser.storage.local.set({ availableNav: navItems });
}

async function hideSections() {
    const settings = (await browser.storage.local.get({ hiddenNav: [] })).hiddenNav;
    
    if (settings.includes('Silk (Dashboard)')) document.getElementById('silk-dashboard-link').style.display = 'none';

    const items = document.querySelectorAll('.ic-app-header__menu-list-item');
    items.forEach(el => {
        if (settings.includes(el.textContent.trim())) el.style.display = 'none';
    });

    document.getElementById('menu').style.display = 'flex';
}

addSilkLogo();
hideSections();
updateAvailableSections();
