var fs = require('fs');
var gpub = require('gpub-go');
var book = require('./book_renderer.js')

var baseDir = __dirname

var dir = baseDir + '/ggg-easy/';
var out = baseDir + '/diagrams/';

if (!fs.existsSync(out)){
  fs.mkdirSync(out);
}

var files = fs.readdirSync(dir)
  .filter(f => f.endsWith('sgf'))
  // Sort based on the number-suffix.
  .sort((a, b) => {
    var anum = parseInt(/\d+/g.exec(a), 10)
    var bnum = parseInt(/\d+/g.exec(b), 10)
    if (anum < bnum) {
      return -1;
    } else if (anum > bnum) {
      return 1;
    }
    return 0;
  });

var contents = files.map(f => fs.readFileSync(dir + f, 'utf8'));

// To make the filenames look nicer, replace the .sgf with _sgf.
ids = files.map(f => f.replace(/\./g, '_'))

/**
 * Simple function that transforms IDs into diagram filenames
 */
var idFuncMaker = (outDir) => {
  var base_ = baseDir;
  return (style, id) => {
    return base_ + '/' + style.toLowerCase() + '/diagrams/' +
        id + '.out.tex';
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

// TODO(kashomon): This doesn't work the way we want since the api-container is
// mutable. Ew. This should make a new version at each step.
for (var style in {'IGO':1, 'GNOS':1}) {
  g.renderDiagramsStream(function(d) {
    fs.writeFile(idFn(style, d.id), d.rendered)
  }, {
    diagramType: style,
  });
  fs.writeFileSync(
    style.toLowerCase() + '/' + 'ggg_easy.tex',
    book.render(style, g.spec(), g.diagrams().metadata, idFn));
}

// These steps not necessary, but here for illustration.
// fs.writeFile('metadata.json', JSON.stringify(g.diagrams().metadata))
// fs.writeFileSync('gpub_spec.json', g.jsonSpec())
