const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function(config) {
  config.setFrontMatterParsingOptions({
    summary: true
  });

  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  config.addPassthroughCopy("assets");

  return {
    dir: {
      includes: "assets",
      layouts: "templates"
    }
  };
};