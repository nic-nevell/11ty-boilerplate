module.exports = {
  eleventyComputed: {
    permalink: data => {
      let fileName = data.page_name.toLowerCase().split(' ').join('-')
      let directory = 'posts'
      let fileExt = 'html'
      return `${directory}/${fileName}.${fileExt}`
    }
  }
}
