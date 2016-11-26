/**
 * Render a problem book!
 * spec: gpub spec
 * diagramMeta: metadata for diagrams.
 * idFn: function to transform IDs to filenames
 */
var renderBook = function(spec, diagramMeta, idFn) {
  var content = '\\documentclass[11pt]{article}\n' +
    '\\usepackage{gnos}\n' +
    '\\usepackage[cmyk]{xcolor}\n' +
    '\\setlength{\\parindent}{0pt}\n' +
    '\\begin{document}\n'

  spec.rootGrouping.positions.forEach(pos => {
    var gen = spec.rootGrouping.generated[pos.id]
    if (!gen) { return; }
    gen.positions.forEach(g => {
      if (g.labels[0] === 'PROBLEM_ROOT') {
        content +=
          '\\begin{minipage}[t]{0.5\\textwidth}\n' +
          '  \\input{' + idFn(g.id) + '}\n' +
          '\\end{minipage}\n'
      }
    });
  })

  spec.rootGrouping.positions.forEach(pos => {
    var gen = spec.rootGrouping.generated[pos.id]
    if (!gen) { return; }
    gen.positions.forEach(g => {
      if (g.labels[0] !== 'PROBLEM_ROOT') {
        content +=
          '\\begin{minipage}[t]{0.5\\textwidth}\n' +
          '  \\input{' + idFn(g.id) + '}\n' +
          '\\end{minipage}\n'
      }
    });
  })


  content += '\\end{document}'

  return content;
};



module.exports = {
  render: renderBook
}
