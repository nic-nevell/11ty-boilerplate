const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/main.css')
  eleventyConfig.addPassthroughCopy('./src/images/*.svg')
  eleventyConfig.addPassthroughCopy('./src/images/*.jpg')
  eleventyConfig.addPassthroughCopy('./src/admin/')

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  return {
    dir: {
      input: './src',
      output: './dist/',
    },
  }
}
