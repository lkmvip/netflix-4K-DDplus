function insertScript(scriptText) {
  var el = document.createElement('script')
  el.text = scriptText
  document.head.appendChild(el)
}

var conf = {
  useDDplus: 1,
  useAVC: 0,
  useDV: 1,
  useHEVC: 0,
  useFHD: 1,
  useHA: 1,
  useDef: 1,
  useCAVC: 0,
  useAVCH: 0,
  useAllSub: 0,
  setMaxBitrate: 0,
}

// very messy workaround for accessing chrome storage outside of background / content scripts
chrome.storage.sync.get(conf, items => {
  var text = ''
  Object.keys(conf).forEach(key => {
    text += text ? ',' : 'var '
    text += key + '=' + (items[key] || 0)
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