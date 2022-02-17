function insertScript(scriptText) {
  var el = document.createElement('script')
  el.text = scriptText
  document.head.appendChild(el)
}

var keys = [
  'useDDplus',
  'useAVC',
  'useDV',
  'useHEVC',
  'useFHD',
  'useHA',
  'useDef',
  'useCAVC',
  'useAVCH',
  'useAllSub',
  'setMaxBitrate'
]

// very messy workaround for accessing chrome storage outside of background / content scripts
chrome.storage.sync.get(keys, items => {
  var text = ''
  keys.forEach(key => {
    text += text ? ',' : 'var '
    text += key + '=' + (items[key] || false)
  })
  insertScript(text)
})

var scriptUrl = chrome.runtime.getURL('max_bitrate.js')
var xhr = new XMLHttpRequest()
xhr.open('GET', scriptUrl, true)
xhr.onload = function (e) {
  var xhr = e.target
  if (xhr.status == 200) {
    insertScript(xhr.responseText)
  }
}
xhr.send()
