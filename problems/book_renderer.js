/**
 * Render a problem book!
 * spec: gpub spec
 * diagramMeta: metadata for diagrams.
 * idFn: function to transform IDs to filenames
 */
var renderBook = function(spec, diagramMeta, idFn) {
  // TODO(kashomon): Can we use
  var content = '\\documentclass[11pt]{article}\n' +
    '\\usepackage{gnos}\n' +
    '\\usepackage[cmyk]{xcolor}\n' +
    '\\setlength{\parindent}{0pt}\n' +
    '\\begin{document}\n'

  spec.rootGrouping.positions.forEach(pos => {
    var gen = spec.rootGrouping.generated[pos.id]
    if (!gen) { return; }
    gen.positions.forEach(g => {
      if (g.labels['PROBLEM_ROOT']) {
        content +=
          '\n' +
          '\\input{diagrams/' + idFn(g.id) + '}\n'
      }
    });
  })

  content += '\\end{document}'

  return content;
};



module.exports = {
  render: renderBook
}
