// From EME Logger extension
/*
script_urls = [
    'https://cdn.rawgit.com/ricmoo/aes-js/master/index.js',
    'https://cdn.rawgit.com/Caligatio/jsSHA/master/dist/sha.js'
]
*/
urls = [
    //'msl_client.js',
    'netflix_max_bitrate.js'
]

// very messy workaround for accessing chrome storage outside of background / content scripts
chrome.storage.sync.get(['useallSub', 'useddplus', 'useAVC', 'useDV', 'useFHD', 'useHA', 'useAVCH', 'setMaxBitrate'], function(items) {
    var useallSub = items.useallSub;
	var useddplus = items.useddplus;
	var useAVC = items.useAVC;
	var useDV = items.useDV;
	var useFHD = items.useFHD;
	var useHA = items.useHA;
	var useAVCH = items.useAVCH;
    var setMaxBitrate = items.setMaxBitrate;
    var mainScript = document.createElement('script');
    mainScript.type = 'application/javascript';
    mainScript.text = 'var useallSub = ' + useallSub + ';' + '\n' 
	                + 'var useddplus = ' + useddplus + ';' + '\n' 
					+ 'var useAVC = ' + useAVC + ';' + '\n' 
					+ 'var useDV = ' + useDV + ';' + '\n' 
					+ 'var useFHD = ' + useFHD + ';' + '\n' 
					+ 'var useHA = ' + useHA + ';' + '\n' 
					+ 'var useAVCH = ' + useAVCH + ';' + '\n' 
	                + 'var setMaxBitrate = ' + setMaxBitrate + ';';
    document.documentElement.appendChild(mainScript);
});
/*
for (var i = 0; i < script_urls.length; i++) {
    var script = document.createElement('script');
    script.src = script_urls[i];
    document.documentElement.appendChild(script);
}
*/
for (var i = 0; i < urls.length; i++) {
    var mainScriptUrl = chrome.runtime.getURL(urls[i]);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', mainScriptUrl, true);

    xhr.onload = function(e) {
        var xhr = e.target;
        var mainScript = document.createElement('script');
        mainScript.type = 'application/javascript';
        if (xhr.status == 200) {
            mainScript.text = xhr.responseText;
            document.documentElement.appendChild(mainScript);
        }
    };

  xhr.send();
}
