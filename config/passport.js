var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/users');
var bcrypt=require('bcryptjs');

module.exports=function(passport){
    passport.use(new LocalStrategy({
        passReqToCallback : true
      }, function(req, username, password, done)  {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));  
    
      passport.serializeUser(function(user,done){
          done(null,user.id);
      });
      passport.deserializeUser(function(user,done){
        User.findById(function(id,done){
            done(err,user);
        });
    });


}