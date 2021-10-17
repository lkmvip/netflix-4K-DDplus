function save_options() {
	var useallSub = document.getElementById('allSub').checked;
	var useddplus = document.getElementById('ddplus').checked;
	var useAVC = document.getElementById('AVC').checked;
	var useDV = document.getElementById('DV').checked;
	var useFHD = document.getElementById('FHD').checked;
	var useHA = document.getElementById('HA').checked;
	var useAVCH = document.getElementById('AVCH').checked;
	var usehevc = document.getElementById('hevc').checked;
    var setMaxBitrate = document.getElementById('setMaxBitrate').checked;
    chrome.storage.sync.set({
        useallSub: useallSub,
		useddplus: useddplus,
		useAVC: useAVC,
		useDV: useDV,
		useFHD: useFHD,
		useHA: useHA,
		useAVCH: useAVCH,
		usehevc: usehevc,
        setMaxBitrate: setMaxBitrate
    }, function() {
        //var status = document.getElementById('status');
        //status.textContent = 'Options saved.';
        /*setTimeout(function() {
            status.textContent = '';
        }, 750);*/
		var r = confirm("Options saved. \r\nRefresh the player page now?");
		if (r == true) {
			chrome.tabs.getSelected(null, function(tab) {
				var code = 'window.location.reload();';
			chrome.tabs.executeScript(tab.id, {code: code});
			});
		}
    });
    
}

function restore_options() {
    chrome.storage.sync.get({
        useallSub: false,
		useddplus: false,
		useAVC: false,
		useDV: false,
		useFHD: false,
		useHA: false,
		useAVCH: false,
		usehevc: false,
        setMaxBitrate: false
    }, function(items) {
        document.getElementById('allSub').checked = items.useallSub;
		document.getElementById('ddplus').checked = items.useddplus;
		document.getElementById('AVC').checked = items.useAVC;
		document.getElementById('DV').checked = items.useDV;
		document.getElementById('FHD').checked = items.useFHD;
		document.getElementById('HA').checked = items.useHA;
		document.getElementById('AVCH').checked = items.useAVCH;
		document.getElementById('hevc').checked = items.usehevc;
        document.getElementById('setMaxBitrate').checked = items.setMaxBitrate;
    });
}



document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);