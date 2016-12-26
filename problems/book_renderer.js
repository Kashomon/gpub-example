/**
 * Render a problem book!
 * style: the diagram style
 * bookMaker: the bookmaker helper
 * idFn: function to transform IDs to filenames
 */
var renderBook = function(style, bookMaker, idFn) {
  if (style == 'SMARTGO') {
    return renderSmartGo(bookMaker);
  }

  var content = '\\documentclass[11pt]{article}\n';

  if (style == 'GNOS') {
    content +=
      '\\usepackage{gnos}\n' +
      '\\usepackage[cmyk]{xcolor}\n';
  } else if (style === 'IGO') {
    content += '\\usepackage{igo}\n';
  }

  content +=
    '\\setlength{\\parindent}{0pt}\n' +
    '\\title{Go Game Guru: Easy Problems}\n' +
    '\\author{GoGameGuru}\n' +
    '\\date{ }\n' +
    '\n' +
    '\\begin{document}\n' +
    '\\maketitle\n' +
    '\\tableofcontents\n';

  problems = '';
  answers = '';

  var latexNewline = '\\\\\n';
  bookMaker.forEachDiagram((idx, config) => {
    var m = config.metadata;
    var filename = idFn(style, config.id);
    var d = '';
    d +=
        '\\begin{minipage}[t]{0.5\\textwidth}\n' +
        '  {\\centering\n';
    d += '  \\input{' + filename + '}\n'
    if (style === 'IGO') {
      d += '\\\\\n'
    }
    d += 'Problem: (' + config.basePosIndex + ')' + latexNewline;
    if (m.comment) {
      d += m.comment + latexNewline;
    }
    d +=
        '  }\n' + // end centering
        '\\end{minipage}\n'

    if (config.hasLabel('PROBLEM_ROOT')) {
      problems += d;
    } else {
      answers += d;
    }
  });

  content += '\\part{Problems!}\n';
  content += problems;
  content += '\\part{Answers!}\n';
  content += answers;

  content += '\\end{document}'
  return content;
};

var renderSmartGo = function(bookMaker) {
  var content =
    '::book(#ggg-easy-probs) title="Go Game Guru: Easy Problems" author="Kashomon"\n' +
    '\n' +
    '::h1 break=none #title#\n' +
    '\n';

  var problems = '';
  var answers = '';

  bookMaker.forEachDiagram((idx, config) => {
    var m = config.metadata;
    var d = config.diagram;
    d += '\n\n';
    var comment = m.comment;
    if (config.hasLabel('CORRECT')) {
      // Usually the text contains 'Correct'.
      // comment += 'Correct.';
    } else if (config.hasLabel('INCORRECT')) {
      if (comment) { comment += ' Incorrect.' }
      else { comment = 'Incorrect.' }
    }
    if (comment) {
      d += comment + '\n\n';
    }

    if (config.hasLabel('PROBLEM_ROOT')) {
      problems += d;
    } else {
      answers += d;
    }
  });
  content +=
    '::h2 The Problems\n' +
    '\n' +
    problems +
    '::h2 The Answers \n' +
    '\n' +
    answers;
  return content;
};

module.exports = {
  render: renderBook
}
