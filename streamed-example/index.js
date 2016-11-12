var fs = require('fs');
var gpub = require('gpub-go');

var contents = fs.readFileSync(
  '20160309-Lee-Sedol-vs-AlphaGo-Commentary-An-Younggil.sgf',
  'utf8');

var g = gpub.init({
    sgfs: [
      contents,
    ],
    ids: [
      'alpha-go-game-1',
    ],
  })
  .createSpec()
  .processSpec()
  .renderDiagramsStream(function(d) {
    fs.writeFile('diagrams/' + d.id + '.out.tex', d.rendered)
  });

fs.writeFile('metadata.json', JSON.stringify(g.diagrams().metadata))

fs.writeFileSync('gpub_spec.json', g.jsonSpec())



// TODO(kashomon): Add book generation when it's done.
