// From EME Logger extension

urls = [
    'netflix_max_bitrate.js'
];

// promisify chrome storage API for easier chaining
function chromeStorageGet(opts) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(opts, (items) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(items);
            }
        });
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

async function loadScripts() {
    for (let i = 0; i < urls.length; i++) {
        const mainScriptUrl = await chrome.runtime.getURL(urls[i]);

        const mainScript = document.createElement('script');
        mainScript.type = 'application/javascript';
        mainScript.src = mainScriptUrl;
        document.documentElement.appendChild(mainScript);
    }
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
    useprk: false,
    usedef: false,
    usef4k: false,
    usef12k: false,
    closeimsc: false,
    useimscn: false,
    usehevc: false,
    imdef: false,
    usesl: false,
    useb: false,
}).then(items => {
    addSettingsToHtml(items);
}).then(() => {
    return loadScripts();
}).catch(error => {
    console.error("Error:", error);
});
