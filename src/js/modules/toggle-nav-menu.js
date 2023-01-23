import { getElem, changeAttributeValue } from '../library/utilities.js'

// toggle-nav-menu
//----------------------------------
;(() => {
  const burgerBtn = getElem('navMenuToggle')
  const navMenu = getElem('navMenu')

  if (!burgerBtn) return
  burgerBtn.addEventListener('click', () => {
    changeAttributeValue(navMenu, 'aria-expanded', 'false', 'true')
    changeAttributeValue(burgerBtn, 'aria-expanded', 'false', 'true')
  })
})()
