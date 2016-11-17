var fs = require('fs');
var gpub = require('gpub-go');

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

var contents = []

files.forEach(f => contents.push(fs.readFileSync(dir + f, 'utf8')));

var g = gpub.init({
    sgfs: contents,
    ids: files,
  })
  .createSpec()
  .processSpec()
  .renderDiagramsStream(function(d) {
    fs.writeFile('diagrams/' + d.id + '.out.tex', d.rendered)
  });

fs.writeFile('metadata.json', JSON.stringify(g.diagrams().metadata))

fs.writeFileSync('gpub_spec.json', g.jsonSpec())
