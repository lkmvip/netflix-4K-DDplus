function save_options() {
	var useallSub = document.getElementById('allSub').checked;
	var useddplus = document.getElementById('ddplus').checked;
	var useAVC = document.getElementById('AVC').checked;
	var useDV = document.getElementById('DV').checked;
    var setMaxBitrate = document.getElementById('setMaxBitrate').checked;
    chrome.storage.sync.set({
        useallSub: useallSub,
		useddplus: useddplus,
		useAVC: useAVC,
		useDV: useDV,
        setMaxBitrate: setMaxBitrate
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        useallSub: false,
		useddplus: false,
		useAVC: false,
		useDV: false,
        setMaxBitrate: false
    }, function(items) {
        document.getElementById('allSub').checked = items.useallSub;
		document.getElementById('ddplus').checked = items.useddplus;
		document.getElementById('AVC').checked = items.useAVC;
		document.getElementById('DV').checked = items.useDV;
        document.getElementById('setMaxBitrate').checked = items.setMaxBitrate;
    });
}



document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);