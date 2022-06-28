const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Mongo = require('./db');

exports.init = function() {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, cb) {
      Mongo.users.findOne({ email })
        .then(function(user) {
          if (!user) { return cb(null, false); }
          if (user.password != password) { return cb(null, false); }
          return cb(null, user);
        });
    })
  );
}

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  Mongo.users.findOne({ email: user.email })
   .then(function(user) {
     if(!user) {
       return cb(false);
     } else {
       cb(null, user);
     }
   });
});