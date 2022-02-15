var keys = [
  'useallSub', 'useddplus', 'useAVC', 'useDV', 'useFHD', 'useHA',
  'useAVCH', 'usedef', 'useCAVC', 'usehevc', 'setMaxBitrate'
]

function insertScript (scriptText) {
  var scriptEl = document.createElement('script')
  scriptEl.text = scriptText
  document.head.appendChild(scriptEl)
}

// very messy workaround for accessing chrome storage outside of background / content scripts
chrome.storage.sync.get(keys, items => {
  var text = 'Object.assign(window, ' + JSON.stringify(items) + ')'
  /*
  keys.forEach(key => {
    text += text ? ',' : 'var '
    text += key + '=' + items[key]
  })
  */
  insertScript(text)
})

var scriptUrl = chrome.runtime.getURL('netflix_max_bitrate.js')
var xhr = new XMLHttpRequest()
xhr.open('GET', scriptUrl, true)
xhr.onload = function (e) {
  var xhr = e.target
  if (xhr.status == 200) {
    insertScript(xhr.responseText)
  }
}
xhr.send()
