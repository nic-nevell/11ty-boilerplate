import { create } from "./utilities.js"

export function scriptLoader(parent, path, boolean) {
  const script = create('script')
  script.src = path
	script.async = boolean
  parent.appendChild(script)
}