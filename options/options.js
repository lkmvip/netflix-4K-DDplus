function findOptions () {
  var inputs = document.querySelectorAll('input'),
      obj    = {}

  inputs.forEach(el => {
    obj[el.id] = el.checked
  })
  return obj
}

function readOptions () {
  var options = findOptions()
  chrome.storage.sync.get(options, items => {
    for (key in items) {
      document.getElementById(key).checked = items[key]
    }
  })
}

function saveOption () {
  var options = findOptions()
  chrome.storage.sync.set(options, () => {
    document.querySelector('i').style.opacity = 1
  })
}

function closePopup () {
  chrome.tabs.getSelected(null, () => {
    chrome.tabs.reload()
  })
  window.close()
}

document.querySelector('button').addEventListener('click', saveOption)
document.querySelector('a').addEventListener('click', closePopup)
document.addEventListener('DOMContentLoaded', readOptions)
