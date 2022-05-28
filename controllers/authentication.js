const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({ subject: user.id , issuedAt : timeStamp}, config.secret);
}

exports.signin = function(req, res, next){
    // User has already email and password
    res.send({ token : tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: 'You must provide an email and password'});
    }

    // see if a user already exists
    User.findOne({ email : email}, function(err, existingUser){
        if (err) { return next(err); }

        // if a user does exists, return an error
        if(existingUser){
            return res.status(422).send({ error: 'Email is in use'});
        }

        // if a user does NOT exist, create and save user record
        const user = new User({
           email : email,
           password : password
        });

        // to save a user
        user.save(function(err){
            if(err) {return next(err);}
        });

        //Respond if the user was created
         res.json({token : tokenForUser(user)});
    });
}