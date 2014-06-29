var router = require('../../src/trout');
var utils = require('./utils');

module.exports = {
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
    
    testAddGet : function(test) {
        router.get('/homeget', this.testHandler);
        test.deepEqual(router.routes.GET["/homeget"], this.testHandler);
        test.done();
    },
    
    testAddPost : function(test) {
        router.post('/homepost', this.testHandler);
        test.deepEqual(router.routes.POST["/homepost"], this.testHandler); 
        test.done();
    },
    
    testAddDelete : function(test) {
        router.delete('/homedelete', this.testHandler);
        test.deepEqual(router.routes.DELETE["/homedelete"], this.testHandler); 
        test.done();
    },
    
    testAddPut : function(test) {
        router.put('/homeput', this.testHandler);
        test.deepEqual(router.routes.PUT["/homeput"], this.testHandler); 
        test.done();
    },
    
    testSingleGroupGet : function(test) {
        var _testcase = this;
        router.group('/getgroup', function() {
            router.get('/1', _testcase.testHandler);
        });
        test.deepEqual(router.routes.GET["/getgroup/1"], this.testHandler);
        test.done();
    },
    
    testSingleGroupPost : function(test) {
        var _testcase = this;
        router.group('/postgroup', function() {
            router.post('/1', _testcase.testHandler);
        });
        test.deepEqual(router.routes.POST["/postgroup/1"], this.testHandler);
        test.done();
    },
    
    testSingleGroupDelete : function(test) {
        var _testcase = this;
        router.group('/deletegroup', function() {
            router.delete('/1', _testcase.testHandler);
        });
        test.deepEqual(router.routes.DELETE["/deletegroup/1"], this.testHandler);
        test.done();
    },
    
    testSingleGroupPut :function(test) {
        var _testcase = this;
        router.group('/putgroup', function() {
            router.put('/1', _testcase.testHandler);
        });
        test.deepEqual(router.routes.PUT["/putgroup/1"], this.testHandler);
        test.done();
    }
    
}

