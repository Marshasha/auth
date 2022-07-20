const AccessControl = require('accesscontrol');

const allRights = {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*']
}


let grantsObject = {

    ROLE_ADMIN:{
        test:allRights,
        profile: allRights
    },
    ROLE_DOCTOR:{
        profile: allRights,
        patients : allRights
    },
    ROLE_PATIENT:{
        profile: {
            'read:own':['*', '!password'],
            'update:own':['*']
        }
    }
}

const roles = new AccessControl(grantsObject);

module.exports = { roles }