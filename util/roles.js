const AccessControl = require('accesscontrol');

const allRights = {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*']
}


let grantsObject = {

    ROLE_ADMIN:{
        test:allRights
    },
    ROLE_DOCTOR:{
        test:{
            'read:any': ['*'],
        }
    }
}

const roles = new AccessControl(grantsObject);

module.exports = { roles }