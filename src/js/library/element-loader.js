import { create, select } from './utilities.js'
export function loadElement(elem, placement, nodeRef) {
  placement = 'after' ? select(nodeRef).after(elem) : null
  placement = 'append' ? select(nodeRef).append(elem) : null
}
