// component imports
//----------------------------------
import {} from './components/chat-widget.js'

// module imports
//----------------------------------
import { loadYoutubeApi } from './modules/youtube-api.js'
import {} from './modules/toggle-nav-menu.js'
import {} from './modules/toggle-accordion.js'

// library imports
//----------------------------------
import { loadFaviconLink } from './library/link-loader.js'
import { loadElement } from './library/element-loader.js'
import { create, body, select } from './library/utilities.js'

// hot reload test
// alert('Assets Loaded')

// load assets
//----------------------------------
window.addEventListener('load', loadLAssets)

function loadLAssets() {
  setTimeout(() => {
    loadFaviconLink('./icons/favicon.svg')
    loadElement(create('chat-widget'), 'after', '.page-footer')

    if (select('.youtube-player')) {
      loadYoutubeApi()
    }
    window.removeEventListener('load', loadLAssets)
  }, 1000)
}

// development
//----------------------------------
