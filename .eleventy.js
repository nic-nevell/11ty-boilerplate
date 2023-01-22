const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/main.css')
  // eleventyConfig.addPassthroughCopy('./src/assets/media/images/*.+(svg|jpg)')
  eleventyConfig.addPassthroughCopy({
    './src/assets/images': 'images',
  })

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
