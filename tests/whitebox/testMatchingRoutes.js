var router = require('../../src/trout');

var testMatchingRoutes = {
    setUp : function(callback) {
        callback();
    },
    
    tearDown : function(callback) {
        callback();
    },

    test1: function(test) {
        test.equal(1, 1);
        test.done();
    }
}

module.exports = testMatchingRoutes;
