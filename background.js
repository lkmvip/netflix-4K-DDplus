chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return {redirectUrl: chrome.runtime.getURL('cadmium-playercore-6.0033.414.911')}
  }, {
    urls: [
      '*://www.assets.nflxext.com/*/ffe/player/html/*.js',
      '*://assets.nflxext.com/*/ffe/player/html/*.js'
    ]
  }, ['blocking']
)
