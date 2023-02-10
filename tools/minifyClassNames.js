const fs = require('fs')

module.exports = files => {
  // The characters available to use for short class-names
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const numbers = '0123456789'.split('')
  const identifiers = []
  const selectors = []

  // The map that will hold the reference between the short names and the original ones
  const map = {}

  // Create short class names, which results in 260 unique class-names
  letters.forEach(letter => {
    numbers.forEach(number => {
      identifiers.push(`.${letter}${number}`)
    })
  })

  // Read each css file and build an array based on the selectors
  files.forEach(file => {
    if (file.input.split('.')[1] === 'css') {
      const fileContent = fs.readFileSync(file.input, { encoding: 'utf8' })

      /**
       * Conditions:
       * - Must start with either "." (classes) or "#" (ids)
       * - Must continue with a letter
       * - After one or multiple letters, optionally it can contain one or multiple letters again, numbers, dashes or underscores
       * - Must be followed by two curly braces facing each other with any character in between them
       * - Reference: https://stackoverflow.com/questions/12391760/regex-match-css-class-name-from-single-string-containing-multiple-classes
       */
      const regex = /(\.|#)[a-z]+[a-z0-9-_]*(?![^\{]*\})/g

      // We create a unique array containing all the selectors only once
      selectors.push(...new Set(fileContent.match(regex)))
    }
  })
}

// https://www.webtips.dev/how-i-reduced-my-css-bundle-size-by-more-than-20-percent?utm_content=cmp-true
