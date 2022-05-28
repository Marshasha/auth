const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Local strategy
const localOptions = { usernameField : 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    // Verify this username and password
    User.findOne({email : email }, function(err, user){
        if(err) { return done(err); }

        if(!user) { return done(null, false); }

        // compare password
        user.comparePassword(password, function(err, isMatch){
            if(err) { return done(err); }
            if(!isMatch) { return done(null, false); }

            return done(null, user);
        });

    });

});


// set up options
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    // if the user ID exist in our DB
    // if it does, call done and accept the user
    // if not, call done without a user

    User.findById(payload.subject, function(err, user){
        if(err) { return done(err, false );  }

        if(user){
            done(null, user);
        }else{
            done(null, false);
        }
    });
});

// Use this strategy
passport.use(jwtLogin);
passport.use(localLogin);