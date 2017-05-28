var express = require('express')
  , passport = require('passport')
  , LinkedinStrategy = require('./lib').Strategy;
  var bodyParser=require('body-parser');
  var mongoose=require('mongoose');
  mongoose.connect('mongodb://nithing:Ravinder8!@ds121171.mlab.com:21171/linkedinbookmark');

var port=process.env.PORT||3000;

// API Access link for creating client ID and secret:
// https://www.linkedin.com/secure/developer
var LINKEDIN_CLIENT_ID = "86dpjz5krwe35i";
var LINKEDIN_CLIENT_SECRET = "OaHbTdY3RX48nvHs";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Linkedin profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the LinkedinStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Linkedin
//   profile), and invoke a callback with a user object.
passport.use(new LinkedinStrategy({
    clientID:     LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL:  "http://localhost:3000/auth/linkedin/callback",
    scope:        [ 'r_basicprofile', 'r_emailaddress'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    req.session.accessToken = accessToken;
    process.nextTick(function () {
      // To keep the example simple, the user's Linkedin profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Linkedin account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());

app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

var Schema = mongoose.Schema;
var Users=new Schema({
  name :{type:String},
  mail:{type:String},
  photo:{type:String},
  bookmarks:[]


});
var User=mongoose.model('userbookmark',Users);

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});
app.get('/bookmarktest',ensureAuthenticated,function(req,res){


  User.find({name:req.user.displayName},function(err,user){
    if(err) throw err;
    res.send(user);
  });
});
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});


// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Linkedin authentication will involve
//   redirecting the user to linkedin.com.  After authorization, Linkedin
//   will redirect the user back to this application at /auth/linkedin/callback
app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE' }),
  function(req, res){
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {

User.find({name:req.user.displayName},function(err,user){
  if(err) throw err;
  console.log(user.length);
  if(user.length==0){
    var user = User({
      name:req.user.displayName,
      mail:req.user.emails[0].value,
      photo:req.user.photos,
      bookmarks:[]
    });
    user.save();
  }
  else{


  }
});
    console.log(req.isAuthenticated());

      res.redirect('/');
    res.end();
  });

app.delete('/delete/:id',function(req,res){
console.log(req.params.id);
User.find({name:req.user.displayName},function(err,user){

User.findById(user[0]._id,function(err,user1){

  user1.bookmarks.splice(req.params.id,1);
  user1.save();

});


});

res.end();

});


app.post('/bookmark',ensureAuthenticated,function(req,res){
//  console.log(req.body);
//arr.map(function(e) { return e.bname; }).indexOf(req.params.boardname);
User.find({name:req.user.displayName},function(err,user){
console.log(req.body);
  User.findById(user[0]._id,function(err,user1){
// console.log(user1.name);
 var i=user1.bookmarks.map(function(e){return e.name;}).indexOf(req.body.name);
  console.log(i);
  if(i>=0){
console.log("bookmark already exists");
res.send("bookmark already exists");
  res.end();
  }
  else{
  user1.bookmarks.push({name:req.body.name,place:req.body.place,title:req.body.title,photo:req.body.pic,title:req.body.title,url:req.body.url,note:req.body.note});
  user1.save();
  res.end();
}

  });

});
  //var user = User({});
  //user.save();

});





app.get('/test',function(req,res){
var x=req.isAuthenticated();
console.log(req.user);
res.end(x+'');

});
app.get('/logout', function(req, res){
  req.logout();
console.log("hello world");

  res.redirect('/');
  res.end();
});

var http = require('http');

http.createServer(app).listen(port);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
