chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return {redirectUrl: chrome.runtime.getURL('cadmium-playercore-6.0034.323.911.js')}
  }, {
    urls: [
      '*://assets.nflxext.com/*/ffe/player/html/*.js'
    ]
  }, ['blocking']
)
