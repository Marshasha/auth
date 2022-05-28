const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define user model

const userSchema = new Schema({
    email : {type : String, unique: true, lowercase : true},
    password : String
});


// On Save Hook, encrypt password
userSchema.pre('save', function(next){
    // get access to the user model
    const user = this;
    console.log(user);

        // generate a salt then run callback
        bcrypt.genSalt(10, function(err, salt){
        if(err) {return next(err); }


        // hash our password by using this salt
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) { return next(err); }

                // overwrite plain text password
                user.password = hash;

                next();

            });
    });
});

userSchema.methods.comparePassword = function(providedPassword, callback){
    bcrypt.compare(providedPassword, this.password, function(err, isMatch){
        if(err){ return callback(err); }

        callback(null, isMatch);

    });
}

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;