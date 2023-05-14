// From EME Logger extension

urls = [
    'netflix_max_bitrate.js'
]

// promisify chrome storage API for easier chaining
function chromeStorageGet(opts) {
    return new Promise(resolve => {
        chrome.storage.sync.get(opts, resolve);
    });
} 

function addSettingsToHtml(settings) {
    const mainScript = document.createElement('script');
    mainScript.type = 'application/json';
    mainScript.text = JSON.stringify(settings);
    mainScript.id = "netflix-4k-5.1ddplus-settings";
    document.documentElement.appendChild(mainScript);

    console.log("Loaded settings");
}

chromeStorageGet({
    setMaxBitrate: false,
    useallSub: false,
    useddplus: false,
    useAVC: false,
    useFHD: false,
    useHA: false,
    useAVCH: false,
    usevp9: false,
    useav1: false,
    useCAVC: false,
    usef4k: false,
    closeimsc: false,
    usehevc: false,
}).then(items => {
    addSettingsToHtml(items);
}).then(() => {
    for (let i = 0; i < urls.length; i++) {
        const mainScriptUrl = chrome.runtime.getURL(urls[i]);
    
        const mainScript = document.createElement('script');
        mainScript.type = 'application/javascript';
        mainScript.src = mainScriptUrl;
        document.documentElement.appendChild(mainScript);
    }
});