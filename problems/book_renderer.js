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

  // TODO(kashomon): There should probably be generally looping functionality.

  // TODO(kashomon): this functionality (lookup) should be part of the API.
  var idToMeta = {};
  diagramMeta.forEach(m => {
    idToMeta[m.id] = m;
  })

  // TODO(kashomon): Functionality should be added to the API to generate the
  // collision labels.

  var index = 1;
  // TODO(kashomon): Alias lookup should be part of the API.
  var aliasToProbIndex = {};
  spec.rootGrouping.positions.forEach(pos => {
    var gen = spec.rootGrouping.generated[pos.id]
    if (!gen) { return; }
    gen.positions.forEach(g => {
      if (g.labels[0] === 'PROBLEM_ROOT') {
        var meta = idToMeta[g.id]
        aliasToProbIndex[g.alias] = index;
        comment = meta.comment;
        if (comment) {
          comment = comment + '\\\\';
        }
        content +=
          '\\begin{minipage}[t]{0.5\\textwidth}\n' +
          '  {\\centering\n' +
          '  \\input{' + idFn(g.id) + '}\n' +
          '  Problem: (' + index + ')\\\\\n' +
          '  ' + comment + '\n' +
          '  }\n' +
          '\\end{minipage}\n'
        index++;
      }
    });
  })

  // TODO(kashomon): Currently there's not a good way to associate diagram
  // metadata back to the original SGF. Concretely, there's not a good way to
  // associate the problem answer with the problem, if you're just looking at
  // the metadata.
  spec.rootGrouping.positions.forEach(pos => {
    var gen = spec.rootGrouping.generated[pos.id]
    if (!gen) { return; }
    gen.positions.forEach(g => {
      if (g.labels[0] !== 'PROBLEM_ROOT') {
        var meta = idToMeta[g.id]
        comment = meta.comment;
        if (comment) {
          comment = comment + '\\\\';
        }
        index = aliasToProbIndex[g.alias];
        content +=
          '\\begin{minipage}[t]{0.5\\textwidth}\n' +
          '  {\\centering\n' +
          '  \\input{' + idFn(g.id) + '}\n' +
          '  Answers to Problem (' + index + ')\\\\\n' +
          '  Status: ' + g.labels[0] + '\\\\\n' +
          '  ' + comment + '\n' +
          '  }\n' +
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
