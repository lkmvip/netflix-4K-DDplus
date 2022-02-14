urls = [
  //'msl_client.js',
  'netflix_max_bitrate.js'
]

// very messy workaround for accessing chrome storage outside of background / content scripts
chrome.storage.sync.get(
  ['useallSub', 'useddplus', 'useAVC', 'useDV', 'useFHD', 'useHA', 'useAVCH', 'usedef', 'useCAVC', 'usehevc', 'setMaxBitrate'],
  function (items) {
    var useallSub = items.useallSub
    var useddplus = items.useddplus
    var useAVC = items.useAVC
    var useDV = items.useDV
    var useFHD = items.useFHD
    var useHA = items.useHA
    var useAVCH = items.useAVCH
    var usedef = items.usedef
    var useCAVC = items.useCAVC
    var usehevc = items.usehevc
    var setMaxBitrate = items.setMaxBitrate
    var scriptEl = document.createElement('script')
    scriptEl.text = 'var useallSub = ' + useallSub + ';\n'
      + 'var useddplus = ' + useddplus + ';\n'
      + 'var useAVC = ' + useAVC + ';\n'
      + 'var useDV = ' + useDV + ';\n'
      + 'var useFHD = ' + useFHD + ';\n'
      + 'var useHA = ' + useHA + ';\n'
      + 'var useAVCH = ' + useAVCH + ';\n'
      + 'var usedef = ' + usedef + ';\n'
      + 'var useCAVC = ' + useCAVC + ';\n'
      + 'var usehevc = ' + usehevc + ';\n'
      + 'var setMaxBitrate = ' + setMaxBitrate + ';'
    document.documentElement.appendChild(scriptEl)
  })

/*
for (var i = 0; i < urls.length; i++) {
  var scriptEl = document.createElement('script')
  scriptEl.src = urls[i]
  document.documentElement.appendChild(scriptEl)
}
*/

for (var i = 0; i < urls.length; i++) {
  var scriptUrl = chrome.runtime.getURL(urls[i])

  var xhr = new XMLHttpRequest()
  xhr.open('GET', scriptUrl, true)
  xhr.onload = function (e) {
    var xhr = e.target
    if (xhr.status == 200) {
      var scriptEl = document.createElement('script')
      scriptEl.text = xhr.responseText
      document.documentElement.appendChild(scriptEl)
    }
  }

  xhr.send()
}
