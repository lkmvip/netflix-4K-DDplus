let getElementByXPath = function (xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

let fn = function () {
  const VIDEO_PLAYING = document.evaluate('//*[@id]/video', document).iterateNext()
  if (!VIDEO_PLAYING) {
    return false
  }

  const VIDEO_SELECT = getElementByXPath('//div[text()=\'Video Bitrate\']')
  const AUDIO_SELECT = getElementByXPath('//div[text()=\'Audio Bitrate\']')
  const BUTTON = getElementByXPath('//button[text()=\'Override\']')

  window.dispatchEvent(new KeyboardEvent('keydown', {
    shiftKey: true, ctrlKey: true, altKey: true, keyCode: 83
  }))

  if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)) {
    return false
  }

  [VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
    let options = el.parentElement.querySelectorAll('select > option')

    for (var i = 0; i < options.length - 1; i++) {
      options[i].removeAttribute('selected')
    }

    options[options.length - 1].setAttribute('selected', 'selected')
  })
  BUTTON.click()
  return true
}

let run = function () {
  fn() || setTimeout(run, 100)
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/
let oldUrl = location.href
if (setMaxBitrate) {
  setInterval(function () {
    let newUrl = location.href
    if (newUrl !== oldUrl && WATCH_REGEXP.test(newUrl)) {
      console.log('netflix max_bitrate enabled')
      oldUrl = newUrl
      run()
    }
  }, 500)
}
