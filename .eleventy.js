const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const formatDate = require('./utils/date.js');

module.exports = function(config) {
  config.setFrontMatterParsingOptions({
    summary: true
  });

  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  config.addFilter('dateFilter', formatDate);

  config.addPassthroughCopy("assets");
  config.addPassthroughCopy("**/assets");

  /* Markdown Plugins */
  const options = {
    html: true,
    breaks: true,
    linkify: true
  };
  const opts = {
    level: [1, 2, 3],
    permalink: false
  };
  config.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    dir: {
      includes: "assets",
      layouts: "templates"
    }
  };
};