module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      return `posts/${data.page_name.toLowerCase().replace(' ', '-')}.html`
    }
  }
};