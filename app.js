var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

const fileUpload = require('./node_modules/express-fileupload/lib/index.js');

require('./api/models/db');

var routes = require('./app/routes/index');
var routesApi = require('./api/routes/index');
// var users = require('./app/routes/users');

var app = express();
app.use(fileUpload());
app.engine('pug', require('pug').__express)
// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('apiCont', path.join(__dirname, 'api', 'controllers'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '5b459127d8512f3fa45ff6a2a86282fa5ba6a138',
    cookie: {
        maxAge: 1000 * 60 * 100
    },
    saveUninitialized: true,
    resave: true
}));

app.use('/', routes);
app.use('/api', routesApi);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
});
