var express = require('express');
var debug = require('debug')('raml-store');

var path = require('path');
var fs = require('fs');
var pp = require('preprocess');

function processStatic(mountPath) {
    // creates dist-override/index.html
    var indexFile = fs.readFileSync(path.join(__dirname, 'node_modules/api-designer/dist/index.html'), 'utf8');
    indexFile = indexFile.replace(/(href="|src=")(.*")/g, '$1' + mountPath + '$2');  
    indexFile = indexFile.replace(/<\/body\>/g, '<script src="angular-persistence.js"></script></body>');
    fs.writeFileSync(path.join(__dirname, 'dist-override/index.html'), indexFile, 'utf8');

    //process angular-persistance.js
    var context = {res: mountPath};
    pp.preprocessFileSync(path.join(__dirname, 'dist-override/angular-persistence.js'), path.join(__dirname, '.tmp/dist-override/angular-persistence.js'), context);
}

function serveStatic (req, res, next) {
  if (req.url === '/index.html' || req.url === '/') {
    return res.sendFile('/index.html', { root: path.join(__dirname, 'dist-override') });
  }
  if (req.url === '/angular-persistence.js') {
    return res.sendFile('/angular-persistence.js', { root: path.join(__dirname, 'dist-override') });
  }
  var requestedFile = req.url.replace(/\?.*/, '');
  debug('requested:', requestedFile);
  res.sendFile(requestedFile, { root: path.join(__dirname, 'node_modules/api-designer/dist') }, function (err) {
    if (!!err && err.code === 'ENOENT') return res.sendStatus(404);
    if (!!err) return next(err);
  });
}

var ramlServe;
module.exports = ramlServe = function (ramlPath, mountPath) {
  var router = express.Router();
  var bodyParser = require('body-parser');
  var api = require('./api')(ramlPath);

  mountPath = mountPath ? (mountPath.match(/\/$/) ? mountPath : mountPath + '/') : '';
  processStatic(mountPath);

  router.use(bodyParser.json());
  router.get('/files/*', api.get);
  router.post('/files/*', api.post);
  router.put('/files/*', api.put);
  router.delete('/files/*', api.delete);
  router.use('/', serveStatic);
  return router;
};

if (module.parent === null) {
  var app = express();
  app.use('/', ramlServe(process.env.RAML_DATAPATH));

  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Express server listening on ' + server.address().address + ':' + server.address().port + '/');
  });
}
