let getElementByXPath = function (xpath) {
	return document.evaluate(
		xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
	).singleNodeValue;
};

let fn = function () {
	const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate / VMAF']");
	const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
	const BUTTON = getElementByXPath("//button[text()='Override']");

	const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
	if(!videoPlayer) {
		console.log("API Not Loading!");
		return false;
	}
	const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
	if(!player) {
		console.log("Video Not Loading!");
		return false;
	}
	if(!player.isPlaying()) {
		console.log("Video Not Playing!");
		return false;
	}

	window.dispatchEvent(new KeyboardEvent('keydown', {
		keyCode: 66,
		ctrlKey: true,
		altKey: true,
		shiftKey: true,
	}));

	if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
		return false;
	}

	[VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
		let parent = el.parentElement;

		let options = parent.querySelectorAll('select > option');

		for (var i = 0; i < options.length - 1; i++) {
			options[i].removeAttribute('selected');
		}

		options[options.length - 1].setAttribute('selected', 'selected');
	});

	console.log("Video Playing!");
	BUTTON.click();

	return true;
};

let run = function () {
	fn() || setTimeout(run, 100)	
};

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if (window.globalOptions === undefined) {
    try {
        window.globalOptions = JSON.parse(document.getElementById("netflix-4k-5.1ddplus-settings").innerText);
    } catch(e) {
        console.error("Could not load settings:", e);
    }
}
if(window.globalOptions.setMaxBitrate ) {
	console.log("netflix_max_bitrate.js enabled");
	//setInterval(test, 500);
	setInterval(function () {
		
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && run();
		}
  }, 500);
}
