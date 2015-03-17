# express-raml-store
fork of [arthurtsang/raml-store](https://github.com/arthurtsang/raml-store), that is a fork of [brianmc/raml-store](https://github.com/brianmc/raml-store).  
Is an Express module serving the awesome work of [mulesoft](https://github.com/mulesoft)/[api-designer](https://github.com/mulesoft/api-designer)  

Instead of saving to mongodb, it saves to the filesystem directly, exportes an handy [Express 4 Router](http://expressjs.com/guide/routing.html#express-router) that you can mount on your desired endpoint

# requirement
sorry for backwards incompatibility, but I love native promises, so this module requires [io.js 1.x](https://iojs.org/) or above.  
It can be refactored to accept a promise library (as [bluebird](https://github.com/petkaantonov/bluebird)), instead of native Promises ([make a PR!](/pulls))

# what
This package is meant to be mounted on your express server when in development mode, allowing to edit the API specification on-the-fly and
_ALSO_ test it (if your development server handles the API)

Example:
```javascript
var app = require('express');
var ramlStore = require('express-raml-store');

// webpages
app.get('/', serveMyHomePage);
app.get('/admin/', greatAdminPanel);

// REST API
app.get('/api/', apiHandler);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs/', ramlStore(path.join(__dirname, 'raml-dir/'), 'api-docs/'));
}

// continue until...
app.listen(3000)
```


# how to use
Just include the module and specify the directory where you desire to host RAML files.

```javascript
var path = require('path');
var app = require('express');
var ramlStore = require('express-raml-store');

app.use('/raml-store/', ramlStore(path.join(__dirname, 'raml-dir/'), 'raml-store/'));
app.listen(3000);
```

express-raml-store also works as stand-alone:

```shell
$ RAML_DATAPATH=api-spec/raml/ node raml-store.js
```

# TODO(s)
I noticed that path traversing is not my best skill, as you see in the example I give up and suggest to use `path.join(__dirname, '<ramlPath>')`
I think this is a good approach, but I'd rather make the library a little more clever on path solving.  
PR are very welcome!
