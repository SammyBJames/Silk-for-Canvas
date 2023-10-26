function get_sections() {
    let sections = document.getElementsByClassName("section");
    let sections_list = {};
    for (let i = 0; i < sections.length; i++) {
        let section_name = sections[i].firstChild.firstChild.textContent.trim();
        if (!isNaN(section_name.split(/\s+/).pop())) {
            let section_list = section_name.split(/\s+/);
            section_list.pop();
            section_name = section_list.join(' ');
        }
        let id = section_name.trim().toLowerCase().split(/\s+/).join('-');
        sections_list[id] = {
            index: i,
            title: section_name,
            element: sections[i],
            hidden: false
        };
    }
    return sections_list;
}


async function customize_sections() {
    // Get course ID
    let course_id = window.location.pathname.split("/")[2];
    // Retrieve course ID settings from storage
    let settings = await chrome.storage.local.get();
    settings = settings[`sections_${course_id}`];
    let sections = get_sections();
    if (settings == null) settings = sections;
    // Check section consistency
    for (const id in sections) {
        if (id in settings) {
            sections[id].hidden = settings[id].hidden;
        }
        if (!sections[id].hidden) sections[id].element.style.display = "block";
    }
    // Save new settings to storage
    let save = {};
    save[`sections_${course_id}`] = sections;
    for (const id in save[`sections_${course_id}`]) {
        delete save[`sections_${course_id}`][id]["element"];
    }
    chrome.storage.local.set(save);
}


customize_sections();
