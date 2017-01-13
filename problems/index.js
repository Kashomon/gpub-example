var fs = require('fs');
var gpub = require('gpub-go');
var book = require('./book_renderer.js')

var baseDir = __dirname

var sgfDir = baseDir + '/ggg-easy/';
var out = baseDir + '/gen_diagrams/';

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

/**
 * Simple function that transforms IDs into diagram filenames
 */
var idFuncMaker = (outDir) => {
  var base_ = baseDir;
  return (style, id, ext) => {
    return base_ + '/' + style.toLowerCase() + '/gen_diagrams/' +
        id + '.out.' + ext;
  }
};
var idFn = idFuncMaker(out);

var g = gpub.init({
    sgfs: contents,
    ids: ids,
    specOptions: {
      positionType: 'PROBLEM',
    },
  })
  .createSpec()
  .processSpec();

['IGO', 'GNOS', 'SMARTGO', 'SVG'].forEach((style) => {
  var gr = g;
  if (style === 'SMARTGO') {
    gr = g.renderDiagrams({
      diagramType: style
    });
  } else {
    gr = g.renderDiagramsStream(function(d) {
          fs.writeFile(idFn(style, d.id, d.fileSuffix), d.rendered)
        }, {
          diagramType: style,
        });
  }

  var out = book.render(style, gr.bookMaker(), idFn);
  if (style != 'SVG') {
    fs.writeFileSync(
      style.toLowerCase() + '/' + 'ggg_easy.' + out.ext,
      out.content);
  }
});
