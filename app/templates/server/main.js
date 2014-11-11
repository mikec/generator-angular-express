var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
<% if(filters.knexAndBookshelf) { %>
var knexConfig = require('../knexfile');
var knex = require('knex')(knexConfig.development);
var bookshelf = require('bookshelf')(knex);
<% } %>

var app = module.exports = express();

var globalConfig = {
    minify: process.env.MINIFY == 'yes' ? true : false
};

var rootPath = path.dirname(__dirname);
var port = Number(process.env.PORT || 9999);

app.set('views', path.join(rootPath, 'server'));
app.engine('html', cons.handlebars);
app.set('view engine', 'html');

<% if(filters.knexAndBookshelf) { %>
app.set('bookshelf', bookshelf);
var models = require('require-directory')(module, './models');
for(var modelName in models) {
    global[modelName] = models[modelName];
    app.set(modelName, models[modelName]);
}
<% } %>

app.use(cookieParser());

app.use(function(req, res, next) {
    var config = configFromReq(req);
    var parsedUrl = url.parse(req.url);
    var splittedPath = parsedUrl.pathname.split(path.sep);

    if (splittedPath[1] && splittedPath[1] !== 'api') {
        splittedPath.splice(1, 0, getMinPrefix(config));
    }

    parsedUrl.pathname = splittedPath.join(path.sep);
    req.url = url.format(parsedUrl);

    req.config = config;
    next();
});

app.use('/', express.static(path.join(rootPath, 'app')));

app.get('/', function(req, res) {
    renderIndex(req.config, res);
});

<% if(filters.knexAndBookshelf) { %>
app.get('/api/users', function(req, res) {
    new User().fetchAll().then(function(users) {
        res.send(users);
    }).catch(function(error) {
        console.log(error.stack);
        res.send('Error getting Users');
    });
});
<% } %>

app.use(function(req, res) {
    res.redirect('/');
});

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});

function renderIndex(config, res) {
    res.render(getMinPrefix(config) + '/views/index');
}

function configFromReq(req) {
    var config = {};
    config.minify = req.cookies.minify == 'true' ? true : false;
    return config;
}

function getMinPrefix(conf) {
    return conf.minify || globalConfig.minify ? 'minified' : 'unminified';
}
