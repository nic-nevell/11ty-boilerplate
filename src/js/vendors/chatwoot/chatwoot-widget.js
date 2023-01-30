export const chatwootWidget = {
  runScript: function () {
    const BASE_URL = 'https://app.chatwoot.com'
    const parentScript = document.createElement(script)
    const childScript = document.getElementsByTagName(script)[0]
    parentScript.src = BASE_URL + '/packs/js/sdk.js'
    parentScript.defer = true
    parentScript.async = true

    childScript.parentNode.insertBefore(parentScript, childScript)

    parentScript.onload = function () {
      window.chatwootSDK.run({
        websiteToken: 'vnMXVJguzy2UggrQYHy26QZv',
        baseUrl: BASE_URL,
      })
    }
  },

  init: () => {
    this.runScript()
  },
}
