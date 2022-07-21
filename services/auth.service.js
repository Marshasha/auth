const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apiError');
const { User } = require('../models/user');
const userService = require('./user.service');

const createUser = async(username, email, password) => {
    try{
        if(await User.emailExists(email)){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry email taken');
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        return user;

    }catch(error){
        throw error;
    }
}

const genAuthToken = (user)=>{
    const token = user.generateAuthToken();
    return token;
}

const signInWithEmailAndPassword = async(email,password) =>{


    try{

        let user = await userService.findUserByEmail(email);

        if(!user){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry BAD email')
        }
        if(!(await user.comparePassword(password))){

            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry BAD password')
        }
        return user;
    } catch(error){
        throw error
    }
}

module.exports = {
    createUser,
    genAuthToken,
    signInWithEmailAndPassword
}