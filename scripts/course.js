function updateAvailableSections(courseId) {
    const items = document.querySelectorAll('.section');
    const sections = [];
    let dedupedSections = [];

    for (const item of Array.from(items)) {
        let sectionName, newSectionName;
        sectionName = newSectionName = item.firstChild.firstChild.textContent.trim();
        if (sections.includes(sectionName)) newSectionName = `${sectionName} (Copy ${sections.filter(secName => secName === sectionName).length})`;
        sections.push(sectionName);
        dedupedSections.push(newSectionName);
    }
    dedupedSections = dedupedSections.filter(section => section !== '');

    const query = {};
    query[`available_${courseId}`] = dedupedSections;
    chrome.storage.sync.set(query);
}

async function hideSections(courseId) {
    const query = {};
    query[`hidden_${courseId}`] = [];
    const settings = (await chrome.storage.sync.get(query))[`hidden_${courseId}`];
    
    const processed = [];
    const items = document.querySelectorAll('.section');
    items.forEach(el => {
        let sectionName, newSectionName;
        sectionName = newSectionName = el.firstChild.firstChild.textContent.trim();
        if (processed.includes(sectionName)) newSectionName = `${sectionName} (Copy ${processed.filter(item => item === sectionName).length})`;
        if (!settings.includes(newSectionName)) el.style.display = 'block';
        processed.push(sectionName);
    });
}

const courseId = window.location.pathname.split('/')[2];
hideSections(courseId);
updateAvailableSections(courseId);
