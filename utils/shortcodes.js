module.exports = {
  youtube: function(embedCode) {
    return `<div class="video-embed"><div style='position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${embedCode}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; width: 100%;"></iframe></div></div>`;
  },
  stream: function(embedCode) {
    return `<div class="video-embed"><div style='position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'><iframe width="640" height="360" src="https://msit.microsoftstream.com/embed/video/${embedCode}?autoplay=false&amp;showinfo=false" allowfullscreen style="border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; width: 100%;"></iframe></div></div>`;
  },
  figure: function(content, captionText) {
    let caption = captionText ? `<figcaption>${captionText}</figcaption>` : '';
    return `<figure>${content}${caption}</figure>`;
  },
  note: function(content, type="info") {
    return `<aside class="note ${type}">
  <span class="note-title">${type == 'alert' ? '!important' : 'Note:'}</span>
  ${content}
</aside>`;
  }
}