module.exports = {
  eleventyComputed: {
    permalink: data => {
      if (data.page_name != 'home') {
        return `/${data.page_name}.html`
      } else {
        return '/index.html'
      }
    }
  }
}
