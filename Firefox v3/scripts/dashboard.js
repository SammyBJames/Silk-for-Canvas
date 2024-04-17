const header = document.getElementById('dashboard_header_container');
const moveLayoutMenuButton = () => {
    let menu = document.getElementById('DashboardOptionsMenu_Container');
    if (menu != null) {
        document.getElementById('header').appendChild(menu);
        observer.disconnect();
    }
};

// Defer moving layout menu button as it is added after DOM loading
const observer = new MutationObserver(moveLayoutMenuButton);
observer.observe(rightPane, { childList: true });
