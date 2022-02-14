chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {
      redirectUrl: chrome.runtime.getURL('cadmium-playercore-6.0033.414.911.js')
    }
  }, {
    urls: [
      '*://www.assets.nflxext.com/*/ffe/player/html/*',
      '*://assets.nflxext.com/*/ffe/player/html/*'

    ]
  }, ['blocking']
)
