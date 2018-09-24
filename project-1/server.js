const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
var debug = require('debug')('livefurniture:server');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');

const mailer = require('express-mailer');

const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}


const app = express();

mongoose.connect('mongodb://localhost/liveFurnish', { useMongoClient: true });
mongoose.set('debug', true);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// API file for interacting with MongoDB

var creditapi = require('./api/credit');
var userapi = require('./api/user_detail');
var edit_profile = require('./api/edit_profile');
var forgot_password = require('./api/forgot_password');
var paymentapi = require('./api/paymentdetail');
var assetapi= require('./api/assetsBundle');
var categoryapi= require('./api/categoryapi');
var searchtagapi= require('./api/searchtagapi');
var buildapi= require('./api/buildapi');
var appuserapi=require('./applicationapi/user_detail')
app.use(function (req, res, next) {
  
       res.setHeader('Access-Control-Allow-Origin', '*');

 

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
})



// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors(corsOptions));
// API location


// Configure express-mail and setup default mail data.
mailer.extend(app, {
  from: 'email',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: '', // gmail id
    pass: '' // gmail password
  }
});



app.use(session(
  {
    secret: 'seacret',
    cookie: { expire: false, maxAge: 300000 },     //in milliseconds. 1 hr 
    rolling: true,
    proxy: true,
    resave: true,
    saveUninitialized: true
  }));
app.use('/buildapi',buildapi);
app.use('/creditapi', creditapi);
app.use('/userapi', userapi);
app.use('/edit_profile', edit_profile);
app.use('/forgot_password', forgot_password);
app.use('/paymentapi', paymentapi);
app.use('/assetapi', assetapi);

app.use('/appuserapi',appuserapi);
app.use('/categoryapi',categoryapi);
app.use('/searchtagapi',searchtagapi);

app.use(express.static('public'));

app.get('/reset_password', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/verify_user', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/forgotPassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/livefurnish/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/livefurnish', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
server.on('listening', onListening);
server.on('error', onError);





//Allow header origin
// Add headers


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}