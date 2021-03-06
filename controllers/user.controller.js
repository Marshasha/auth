const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apiError');

const { userService, authService, emailService } = require('../services');

const userController = {
    async profile(req,res,next){
        try{
            const user = await userService.findUserById(req.user._id);
            if(!user){
                throw new ApiError(httpStatus.NOT_FOUND,'User not found')
            }
            res.json(res.locals.permission.filter(user._doc))
        } catch(error){
            next(error)
        }
    },
    async allPatients(req, res, next){
        try{
            const listOfPatients = await userService.findAllPatients();
            if(listOfPatients.length === 0){
                throw new ApiError(httpStatus.NOT_FOUND,'No patients in the list')
            }
            res.json(listOfPatients)
        }catch(error){
            next(error)
        }
    },
    async updateProfile(req,res,next){
        try{
            const user = await userService.updateUserProfile(req)
            res.json(res.locals.permission.filter(user._doc))
        } catch(error){
            next(error)
        }
    },
    async updateUserEmail(req,res,next){
        try{
            const user = await userService.updateUserEmail(req);
            const token = await authService.genAuthToken(user);

            // send verification email
            await emailService.registerEmail(user.email,user);

            res.cookie('x-access-token',token)
                .send({
                    user: res.locals.permission.filter(user._doc),
                    token
                })
        } catch(error){
            next(error)
        }
    },

}


module.exports = userController;

