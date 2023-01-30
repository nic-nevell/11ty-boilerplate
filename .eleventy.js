const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/admin/')

  eleventyConfig.addWatchTarget('./src/')

  eleventyConfig.setWatchJavaScriptDependencies(false)
  eleventyConfig.setUseGitIgnore(false)

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
