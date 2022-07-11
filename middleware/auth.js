const passport = require('passport');
const { ApiError} = require('./apiError');
const httpStatus = require('http-status');
const { roles } = require('../util/roles')


const verify = (req, res, resolve, reject, rights) => async(err, user) => {
    if(err || !user){
        console.log("No User " + user)
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Sorry, unauthorized'))
    }

    req.user = {
        _id : user._id,
        role : user.role,
    }

    if(rights.length){
        const action = rights[0] // create any
        const resource = rights[1]
        const permission = roles.can(req.user.role)[action](resource);

        if(!permission.granted){
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Sorry, you dont have rights'))
        }

        res.locals.permission = permission;
    }

    resolve()
}

const auth = (...rights) => async(req, res, next)=>{

    return new Promise((resolve, reject)=>{

        passport.authenticate('jwt', {sessions: false}, verify(req, res, resolve, reject, rights))(req, res, next)
    })
        .then(()=> next())
        .catch((err)=>next(err))
}


module.exports = auth;