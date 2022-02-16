chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return {redirectUrl: chrome.runtime.getURL('cadmium-player-6.0033.414.911.js')}
  }, {
    urls: [
      '*://www.assets.nflxext.com/*/ffe/player/html/cadmium-player-*.js',
      '*://assets.nflxext.com/*/ffe/player/html/cadmium-player-*.js'
    ]
  }, ['blocking']
)
