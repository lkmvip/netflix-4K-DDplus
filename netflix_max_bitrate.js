let getElementByXPath = function (xpath) {
  return document.evaluate(
    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue
}

let fn = function () {
  const VIDEO_SELECT = getElementByXPath('//div[text()=\'Video Bitrate\']')
  const AUDIO_SELECT = getElementByXPath('//div[text()=\'Audio Bitrate\']')
  const BUTTON = getElementByXPath('//button[text()=\'Override\']')

  const VIDEO_PLAYING = document.evaluate('//*[@id]/video', document).iterateNext()

  if (!VIDEO_PLAYING) {
    return false
  }

  window.dispatchEvent(new KeyboardEvent('keydown', {
    shiftKey: true, // indicates auto setMaxBitrate
    // ctrlKey: true,
    altKey: true,
    keyCode: 83
  }))

  if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)) {
    return false
  }

  [VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
    let parent = el.parentElement

    let options = parent.querySelectorAll('select > option')

    for (var i = 0; i < options.length - 1; i++) {
      options[i].removeAttribute('selected')
    }

    options[options.length - 1].setAttribute('selected', 'selected')
  })
  BUTTON.click()
  return true
}

// The test version is not guaranteed to be valid
// Instructions
// Play any movie, move the mouse to the audio and subtitles tab and enjoy.
// If not, refresh the page and repeat the steps
// It may be improved in the future, or it may be given up, depending on Netflix
/*
	let test = function(){
	var timesRun = 0;
	var interval = setInterval(function(){
	timesRun += 1;
	if(timesRun === 20){
		clearInterval(interval);
	}
			var ov = document.styleSheets[2];
			ov.insertRule(".ltr-m6m86k {overflow-y: auto;}", ov.rules.length);
			var ov2 = document.styleSheets[8];
			ov2.insertRule(".ltr-m6m86k {overflow-y: auto;}", ov2.rules.length);
	}, 500);
}
*/

let run = function () {
  fn() || setTimeout(run, 100)
  // fn() ? setTimeout(test, 100) : setTimeout(run, 100)
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/

let oldLocation

if (setMaxBitrate) {
  console.log('netflix_max_bitrate.js enabled')
  setInterval(function () {
    let newLocation = window.location.toString()

    if (newLocation !== oldLocation) {
      oldLocation = newLocation
      WATCH_REGEXP.test(newLocation) && run()
    }
  }, 500)
}
