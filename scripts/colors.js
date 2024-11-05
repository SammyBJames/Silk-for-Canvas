async function customizeColors() {
    const query = {
        accent: '1F6199',
        primaryColor1: '10B1E7',
        primaryColor2: '5852A3',
        primaryColor3: 'B72F2B',
        backgroundColor: '151515',
        foregroundColor: 'FFFFFF'
    };
    const setting = await chrome.storage.sync.get(query);
    const style = document.createElement('style');
    document.head.appendChild(style);
    const rule = `:root {
        --ic-link-color: #${setting.accent} !important;
        --silk-gradient: linear-gradient(120deg, #${setting.primaryColor1} 0%, #${setting.primaryColor2} 50%, #${setting.primaryColor3} 100%) !important;
        --silk-gradient-alt: linear-gradient(120deg, #${setting.primaryColor1} 0%, #${setting.primaryColor2} 30%, #${setting.primaryColor3} 60%, #${setting.primaryColor3} 100%) !important;
        --background-color: #${setting.backgroundColor} !important;
        --foreground-color: #${setting.foregroundColor} !important;
    }`
    style.sheet.insertRule(rule);
}

customizeColors();
