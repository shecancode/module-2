require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const User         = require('./models/user')
const Pet          = require('./models/pet')
const passport     = require('passport');
const LocalStrategy= require('passport-local').Strategy;
const session      = require('express-session');
const bcrypt       = require('bcrypt');
const flash        = require('connect-flash')
// const api         = petfinder.PetFinderClient(api_key='c6c8a1519183ccfdf3c594afd6c2cf4e', api_secret='028811f204561647bf88beb8492e8af5')


mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Module 2 project';
app.use(flash());

//passport config area
passport.serializeUser((user, cb) => {
  console.log("====: ", user)
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    console.log("blah: ", user)
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  console.log("hey")

  User.findOne({ email: username }, (err, user) => {
    console.log("user is: ", user)
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect email' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }

    return next(null, user);
  });
}));



app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes)
const pet = require('./routes/pet-routes');
app.use('/', pet)


module.exports = app;
