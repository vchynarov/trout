var router = require('../../src/trout');

var testMatchingRoutes = {
    setUp : function(callback) {
        callback();
    },
    
    tearDown : function(callback) {
        callback();
    },
    
    test1 : function(test) {
        test.ok(1==1);
        test.done();
    },
    
    test2: function(test) {
        test.equal(1, 2-1);
        test.equal(6, 2*3);
        test.done();
    },
    
    test3: function(test) {
        test.equal("hello","hell" + "o");
        test.equal("dog", "cat");
        test.equal(1, 1);
        test.done();
    },

    test4: function(test) {
        test.equal(1, 2);
        test.done();
    }

}

module.exports = testMatchingRoutes;
