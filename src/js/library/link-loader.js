export function loadLink(rel, type, href) {
  let link = document.createElement('link')
	link.rel = rel
	link.type = type
  link.href = href
  document.head.appendChild(link)
}

export function loadFaviconLink(href) {
  let link = document.createElement('link')
	link.rel = 'icon'
	link.type = 'image/svg+xml'
  link.href = href
  document.head.appendChild(link)
}

export function loadFontLink(href) {
  let link = document.createElement('link')
	link.rel = 'stylesheet'
	link.type = 'text/css'
  link.href = href
  document.head.appendChild(link)
}