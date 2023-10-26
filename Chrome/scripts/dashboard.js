async function add_view_button() {
    let header = document.getElementById("dashboard_header_container");
    // Wait for options menu to load
    let add_menu = () => {
        let menu = document.getElementById("DashboardOptionsMenu_Container");
        if (menu != null) {
            document.getElementById("header").appendChild(menu);
            observer.disconnect();
        }
    };
    let observer = new MutationObserver(add_menu);
    observer.observe(header, { childList: true });
    add_menu();
}


add_view_button();
