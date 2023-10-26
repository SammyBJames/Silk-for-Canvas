function set_favicon() {
    let links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
        if (links[i].type == "image/x-icon") links[i].href = chrome.runtime.getURL("icons/icon.svg");
    }
}


set_favicon()
