const { DateTime } = require('luxon')
const htmlMin = require('html-minifier')
const postHtml = require('posthtml')
const uglify = require('posthtml-minify-classnames')
const markdownIt = require('markdown-it')
const { EleventyRenderPlugin } = require('@11ty/eleventy')

module.exports = function (eleventyConfig) {
  // passthrough
  //----------------------------------
  eleventyConfig.addPassthroughCopy('./src/admin/')

  // watch
  //----------------------------------
  eleventyConfig.addWatchTarget('./src/')
  eleventyConfig.setWatchJavaScriptDependencies(false)

  // use
  //----------------------------------
  eleventyConfig.setUseGitIgnore(false)

  // plugins
  //----------------------------------
  eleventyConfig.addPlugin(EleventyRenderPlugin, {
    tagName: 'renderTemplate', // Change the renderTemplate shortcode name
    tagNameFile: 'renderFile' // Change the renderFile shortcode name
  })

  // short codes
  //----------------------------------

  let mdDefaults = {
    html: false,
    linkify: true,
    breaks: true,
    _highlight: true,
    typographer: true
  }
  md = require('markdown-it')(mdDefaults)

  eleventyConfig.addPairedShortcode('markdown', content => {
    return md.render(content)
  })

  // filters
  //----------------------------------
  eleventyConfig.addFilter('postDate', dateObj => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })
  eleventyConfig.addFilter('cleanImageExtension', fileName => {
    fileName = fileName.split('.')
    fileName.pop()
    fileName = fileName.join('')
    return fileName
  })

  // transforms
  //----------------------------------
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
      includes: '_includes',
      layouts: '_includes/_layouts'
    }
  }
}
