import { selectAll, changeAttributeValue } from '../library/utilities.js'

// toggle accordion
//----------------------------------
;(() => {
  const accordionToggles = selectAll('.toggle-accordion')

  if (!accordionToggles) return

  accordionToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const target = e.target
      const content = target.nextElementSibling

      changeAttributeValue(target, 'aria-expanded', 'false', 'true')
      changeAttributeValue(content, 'aria-expanded', 'false', 'true')
    })
  })
})()
