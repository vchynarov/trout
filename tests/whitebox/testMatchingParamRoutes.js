var router = require('../../src/trout');
var utils = require('./utils');


var testMatchingParamRoutes = {
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
    
    testSingleParamGetMatch : function(test) {
        router.get('/pbget/:name', this.testHandler);
        test.ok(router.existsRoute("/pbget/viktor", "GET"));
        test.ok(router.existsRoute("/pbget/viktor/", "GET"));
        test.ok(router.existsRoute("/pbget/viktor?", "GET"));
        test.ok(router.existsRoute("/pbget/viktor/?something=1&else=2", "GET"));
        test.ok(router.existsRoute("/pbget/viktor?something=1&else=2", "GET"));
        test.done();
    },
    
    testSingleParamPostMatch : function(test) {
        router.post('/pbpost/:name', this.testHandler);
        test.ok(router.existsRoute("/pbpost/viktor", "POST"));
        test.ok(router.existsRoute("/pbpost/viktor/", "POST"));
        test.ok(router.existsRoute("/pbpost/viktor?", "POST"));
        test.ok(router.existsRoute("/pbpost/viktor/?something=1&else=2", "POST"));
        test.ok(router.existsRoute("/pbpost/viktor?something=1&else=2", "POST"));
        test.done();
    },
    
    testSingleParamPutMatch : function(test) {
        router.put('/pbput/:name', this.testHandler);
        test.ok(router.existsRoute("/pbput/viktor", "PUT"));
        test.ok(router.existsRoute("/pbput/viktor/", "PUT"));
        test.ok(router.existsRoute("/pbput/viktor?", "PUT"));
        test.ok(router.existsRoute("/pbput/viktor/?something=1&else=2", "PUT"));
        test.ok(router.existsRoute("/pbput/viktor?something=1&else=2", "PUT"));
        test.done();
    },
    
    testSingleParamDeleteMatch : function(test) {
        router.delete('/pbdelete/:name', this.testHandler);
        test.ok(router.existsRoute("/pbdelete/viktor", "DELETE"));
        test.ok(router.existsRoute("/pbdelete/viktor/", "DELETE"));
        test.ok(router.existsRoute("/pbdelete/viktor?", "DELETE"));
        test.ok(router.existsRoute("/pbdelete/viktor/?something=1&else=2", "DELETE"));
        test.ok(router.existsRoute("/pbdelete/viktor?something=1&else=2", "DELETE"));
        test.done();
    },
};

module.exports = testMatchingParamRoutes;
