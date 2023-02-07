const { DateTime } = require('luxon')
const  htmlMin  = require('html-minifier')
const  postHtml  = require('posthtml')
const  uglify  = require('posthtml-minify-classnames')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/admin/')
  eleventyConfig.addWatchTarget('./src/')
  eleventyConfig.setWatchJavaScriptDependencies(false)
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })
  eleventyConfig.addFilter('cleanImageExtension', (fileName) => {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName
  })

  //   eleventyConfig.addTransform("htmlMin", async function(content, outputPath) {
  //     const { html } = await postHtml().use(uglify()).process(content)
  //   if( outputPath.endsWith(".html") ) {
  //     let minified = htmlMin.minify(content, {
  //       useShortDoctype: true,
  //       removeComments: true,
  //       collapseWhitespace: true
  //     });
  //     return minified;
  //   }

  //   return content;
  // });


  return {
    dir: {
      input: './src',
      output: './dist/',
    },
  }
}
