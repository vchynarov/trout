var router = require('../../src/trout');
var utils = require('./utils');


var testMatchingRoutes = {
    setUp : function(callback) {
        this.token = utils.createToken();
        this.testHandler = utils.testHandlerGenerator(this.token);
        this.routerShouldReset = false;
        callback();
    },
    
    tearDown : function(callback) {
        if (!this.routerShouldReset) {
            //console.log("yeah..should NOT reset!");
        }
        else {
            utils.resetRouter();     
        }

        callback();
    },
    

    /**
     * Testing singular route matching, no params!
     */
    existsBasicSingularGet: function(test) {
        test.ok(router.existsRoute("/homeget", "GET"));
        test.done();
    },
    
    existsBasicSingularPost: function(test) {
        test.ok(router.existsRoute("/homepost", "POST"));
        test.done();
    },
    
    existsBasicSingularDelete: function(test) {
        test.ok(router.existsRoute("/homedelete", "DELETE"));
        test.done();
    },
    
    existsBasicSingularPut: function(test) {
        test.ok(router.existsRoute("/homeput", "PUT"));
        test.done();
    },

    /**
     * Testing basic group matching, no params!
     */
    existsGroupSingularGet: function(test) {
        test.ok(router.existsRoute("/getgroup/1", "GET"));
        test.done();
    },
    
    existsGroupSingularPost: function(test) {
        test.ok(router.existsRoute("/postgroup/1", "POST"));
        test.done();
    },
    
    existsGroupSingularDelete: function(test) {
        test.ok(router.existsRoute("/deletegroup/1", "DELETE"));
        test.done();
    },
    
    existsGroupSingularPut: function(test) {
        test.ok(router.existsRoute("/putgroup/1", "PUT"));
        test.done();
    }
};

module.exports = testMatchingRoutes;
