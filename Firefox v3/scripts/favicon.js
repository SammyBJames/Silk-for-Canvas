// Change favicon to the Silk logo
const links = document.querySelectorAll('link');
links.forEach(link => {
    if (link.type === 'image/x-icon') link.href = browser.runtime.getURL('icons/icon.svg');
});
