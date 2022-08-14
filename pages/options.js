function save_options() {
	var useallSub = document.getElementById('allSub').checked;
	var useddplus = document.getElementById('ddplus').checked;
	var useAVC = document.getElementById('AVC').checked;
	var useFHD = document.getElementById('FHD').checked;
	var useHA = document.getElementById('HA').checked;
	var useAVCH = document.getElementById('AVCH').checked;
	var usedef = document.getElementById('def').checked;
	var usevp9 = document.getElementById('vp9').checked;
	var useav1 = document.getElementById('av1').checked;
	var usehevc = document.getElementById('hevc').checked;
    var closeimsc = document.getElementById('closeimsc').checked;
    var setMaxBitrate = document.getElementById('setMaxBitrate').checked;
    chrome.storage.sync.set({
        useallSub: useallSub,
		useddplus: useddplus,
		useAVC: useAVC,
		useFHD: useFHD,
		usedef: usedef,
		useHA: useHA,
		useAVCH: useAVCH,
		usevp9: usevp9,
		useav1: useav1,
		usehevc: usehevc,
		closeimsc: closeimsc,
        setMaxBitrate: setMaxBitrate
    }, function() {
        //var status = document.getElementById('status');
        //status.textContent = 'Options saved.';
        /*setTimeout(function() {
            status.textContent = '';
        }, 750);*/
		var r = confirm("Options saved. \r\nRefresh the player page now?");

		if (r == true) {
			chrome.tabs.query({active: true, currentWindow: true}, function () {
				chrome.tabs.reload();
			});
		}
		window.open("about:blank","_self").close()
    });
    
}

function restore_options() {
    chrome.storage.sync.get({
        useallSub: false,
		useddplus: false,
		useAVC: false,
		useFHD: false,
		usedef: false,
		useHA: false,
		useAVCH: false,
		usevp9: false,
		useav1: false,
		usehevc: false,
		closeimsc: false,
        setMaxBitrate: false
    }, function(items) {
        document.getElementById('allSub').checked = items.useallSub;
		document.getElementById('ddplus').checked = items.useddplus;
		document.getElementById('AVC').checked = items.useAVC;
		document.getElementById('FHD').checked = items.useFHD;
		document.getElementById('def').checked = items.usedef;
		document.getElementById('HA').checked = items.useHA;
		document.getElementById('AVCH').checked = items.useAVCH;
		document.getElementById('vp9').checked = items.usevp9;
		document.getElementById('av1').checked = items.useav1;
		document.getElementById('hevc').checked = items.usehevc;
		document.getElementById('closeimsc').checked = items.closeimsc;
        document.getElementById('setMaxBitrate').checked = items.setMaxBitrate;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);