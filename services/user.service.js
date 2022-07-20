const { User } = require('../models/user');
const { ApiError } = require('../middleware/apiError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const findUserByEmail = async(email) => {
    console.log("Email requested " + email)
    return User.findOne({email});
}

const findUserById = async (_id) => {
    return User.findById(_id);
}

const findAllPatients = async () => {
    return User.find({role : 'ROLE_PATIENT'}, {item: 1, username : 1});
}

const updateUserProfile = async(req) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id},
            {
                "$set" : {
                    username : req.body.username,
                }
            },
            { new : true }
        )
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
        return user;
    }catch(error){
        throw error
    }
}

const updateUserEmail = async(req) => {
    try{
        if(await User.emailExists(req.body.newemail)){
            throw new ApiError(httpStatus.NOT_FOUND,'Sorry email taken')
        }
        const user = await User.findOneAndUpdate(
            { _id:req.user._id, email: req.user.email },
            {
                "$set":{
                    email: req.body.newemail,
                    verified:false
                }
            },
            { new: true }
        )
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND,'User not found')
        }
        return user;
    } catch(error){
        throw error
    }
}

const validateToken = (token) => {
    return jwt.verify(token,process.env.DB_SECRET)
}


module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile,
    updateUserEmail,
    validateToken,
    findAllPatients
}