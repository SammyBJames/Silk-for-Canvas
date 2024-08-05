function updateAvailableSections(courseId) {
    const items = document.querySelectorAll('.section');

    let sections = Array.from(items).map(section => section.firstChild.firstChild.textContent.trim());
    sections = sections.filter(section => section !== '');

    const query = {};
    query[`available_${courseId}`] = sections;
    chrome.storage.sync.set(query);
}

async function hideSections(courseId) {
    const query = {};
    query[`hidden_${courseId}`] = [];
    const settings = (await chrome.storage.sync.get(query))[`hidden_${courseId}`];
    
    const items = document.querySelectorAll('.section');
    items.forEach(el => {
        if (!settings.includes(el.firstChild.firstChild.textContent.trim())) el.style.display = 'block';
    });
}

const courseId = window.location.pathname.split('/')[2];
hideSections(courseId);
updateAvailableSections(courseId);
