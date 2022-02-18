let fn = function () {
  if (!document.querySelector('video')) {
    return
  }

  window.dispatchEvent(new KeyboardEvent('keydown', {
    shiftKey: true, altKey: true, keyCode: 83
  }))

  var selects = document.querySelectorAll('.player-streams select')
  var btns = document.querySelector('.player-streams button')
  if (selects.length + btns.length < 5) {
    return
  }

  for (var i = selects.length - 2; i >= 0; i--) {
    let options = selects[i].options
    Array.from(options).forEach(o => o.removeAttribute('selected'))
    options[options.length - 1].setAttribute('selected', 'selected')
  }
  btn[0].click()
  return true
}

let run = function () {
  fn() || setTimeout(run, 100)
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/
let oldUrl = location.href
if (window.setMaxBitrate) {
  setInterval(function () {
    let newUrl = location.href
    if (newUrl !== oldUrl && WATCH_REGEXP.test(newUrl)) {
      console.log('Netflix max_bitrate enabled')
      oldUrl = newUrl
      run()
    }
  }, 500)
}
