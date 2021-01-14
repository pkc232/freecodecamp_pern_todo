const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = "573639394012-d1dmvqivunj1o83hcaa1fodu6lcb17b5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "xNTtPBuqfX876eyVt8TzryrL";
const CALLBACKURL = process.env.NODE_ENV === "production" ? 
"https://pkc-todo.herokuapp.com/todos": "http://localhost:3000/todos";

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({ 
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACKURL,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));