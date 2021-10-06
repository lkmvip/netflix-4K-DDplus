let getElementByXPath = function (xpath) {
	return document.evaluate(
		xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
	).singleNodeValue;
};

let fn = function () {
	const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate']");
	const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
	const BUTTON = getElementByXPath("//button[text()='Override']");

	const VIDEO_PLAYING = document.evaluate('//*[@id]/video',document).iterateNext();
	
	if(!VIDEO_PLAYING) {
		return false;
	}

	window.dispatchEvent(new KeyboardEvent('keydown', {
		keyCode: 83,
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
	BUTTON.click();
	return true;
};

let run = function () {
	fn() || setTimeout(run, 100)
};

let test = function(){
	//The test version is not guaranteed to be valid
	//Instructions
	//Play any movie, when it starts to play, refresh the page, when it starts to play again, the audio and subtitle pages can be scrolled with the mouse
	//It may be improved in the future, or it may be given up, depending on Netflix
	var ov = document.styleSheets[2];
	ov.insertRule(".ltr-m6m86k {overflow-y: auto;}", ov.rules.length);
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;


if(setMaxBitrate ) {
	console.log("netflix_max_bitrate.js enabled");
	setInterval(test, 500); //activate overflow
	setInterval(function () {
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && run();
		}
  }, 500);
}
