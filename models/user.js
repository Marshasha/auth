const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Define user model

const userSchema = new mongoose.Schema({
    username : {type: String, required : true, unique : true },
    email : {
        type : String,
        unique: true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Invalid email')
            }
        }
    },
    password : {type: String, required : true, trim : true,},
    role : {
        type: String,
        enum: ['ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN'],
        default : 'ROLE_PATIENT'
    },
    date : {
        type : Date,
        default : Date.now
    },
    verified: {
        type : Boolean,
        default : false
    }

});


// On Save Hook, encrypt password
userSchema.pre('save', async function(next){
    // get access to the user model
    let user = this;

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }

    next()

});

userSchema.statics.emailExists = async function(email){
    const user = await this.findOne({email});

    return !!user
}

userSchema.methods.generateAuthToken = async function(){
    let user = this;
    const userObj = { sub : user._id.toHexString(), email : user.email};
    const timeStamp = new Date().getTime();
    const token = jwt.sign(userObj, process.env.DB_SECRET, {expiresIn : '1d'})

    return token;

}

userSchema.methods.comparePassword = async function(providedPassword, callback){
    const user = this;
    const match = await bcrypt.compare(providedPassword, user.password);
    return match;
}

/*

userSchema.methods.generateRegisterToken = async function(){
    let user = this;
    const userObj = { sub: user._id.toHexString()};
    const timeStamp = new Date().getTime();
    const token = jwt.encode({subject : userObj, issuedAt : timeStamp}, config.secret)
    return token;
} */

// Create model class
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = { User };