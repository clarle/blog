function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = function(code, lang, escaped) {
    if (this.options.highlight) {
        var out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if (!lang) {
      return '<pre class="line-numbers"><code>'
          + (escaped ? code : escape(code, true))
          + '</code></pre>';
    }

    return '<pre class="line-numbers '
        + this.options.langPrefix
        + escape(lang, true)
        + '"><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + '</code></pre>';
};
