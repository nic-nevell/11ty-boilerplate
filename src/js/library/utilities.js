// global variables
//----------------------------------
export const body = document.body
export const head = document.head
export const getElem = (id) => document.getElementById(id)

// change attribute value
//----------------------------------
export function changeAttributeValue(elem, attribute, valueA, valueB) {
  const value = elem.getAttribute(attribute)

  value === valueA
    ? elem.setAttribute(attribute, valueB)
    : elem.setAttribute(attribute, valueA)
}

// toggle class
export function toggleClass(elem, className) {
  elem.classList.toggle(className)
}

// create element
//----------------------------------
export function create(element, attrName, attrValue) {
  const newElem = document.createElement(element)
  attrName && attrValue ? newElem.setAttribute(attrName, attrValue) : null

  return newElem
}

// get attribute values/names
//----------------------------------
export const getValue = (element, attribute) =>
  select(element).getAttribute(attribute)

export const getNames = (element) => select(element).getAttributeNames()

export const getClassList = (element) => select(element).classList

export const containsClass = (elements, value) => {
  let selected = selectAll(elements)

  selected.forEach((element) => {
    if (element.classList.contains(value)) {
      console.log(element)
      return element
    }
  })
}

// select elements
//----------------------------------
export function select(element) {
  let selected = document.querySelector(element)
  return selected
}

export function selectAll(element) {
  let selected = document.querySelectorAll(element)
  return selected
}
