var router = require('../../src/trout');
var utils = require('./utils');


var testMatchingRoutes = {
    setUp : function(callback) {
        console.log(router);
        callback();
    },
    
    tearDown : function(callback) {
        callback();
    },

    test1: function(test) {
        router.put('/headput', utils.testHandlerGenerator('asdf'));
        test.done();
    }
}

module.exports = testMatchingRoutes;
