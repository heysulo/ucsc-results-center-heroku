const _ = require('lodash');

let permissionModules = {
    'admin': {
        base: 50,
        routes: {
            '/console/clear' : 100,
            '/system/maintenance' : 100,
            '/result/dataset' : 100,
            '/console/generate/[0-9]{1,}' : 100,
            '/monitoring/*' : 100,
            '/calculate/pattern/[0-9]{1,}' : 100
        }
    },

    'user': {
        base: 0,
        routes: {
            '/validate' : 0
        }
    },

    'v1.0': {
        base: 10,
        routes: {

        }
    }
};

module.exports = permissionModules;