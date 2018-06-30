/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes/index');
var user = require('./routes/users').user;
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');
var ejs = require('ejs') ;	 
var app = express();
var identity = 'kang';
 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html',ejs.__express) ; 
app.set('view engine', 'html');	 

 
app.use(logger('dev'));
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: identity,
  secret: 'secret',
  // store: new FileStore(),
  saveUninitialized: false,  //是否自动保存未初始化的会话，建议false
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 *24 * 31
  }
}))

app.get('/', routes.login);
app.get('/login', routes.logout);
app.post('/home', routes.doLogin);	
app.get('/home',routes.goHome);
app.get('/index', routes.index);	 


app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  res.locals.message = '';
  if (err) {
    res.locals.message = '<div style="margin-bottom: 20px;color:red;z-index:9999;">' + err + '</div>';
  }
  next();
});
 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

 
 	 
 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
