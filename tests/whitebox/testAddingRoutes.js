var router = require('../../src/trout');


var utils = require('./utils');
        
module.exports = {
    setUp : function(callback) {
        this.token = utils.createToken();
        this.testHandler = utils.testHandlerGenerator(this.token);
        callback();
    },
    
    tearDown : function(callback) {
        console.log(router.routes);
        utils.resetRouter();
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
        router.post('/homedelete', this.testHandler);
        test.deepEqual(router.routes.POST["/homedelete"], this.testHandler); 
        test.done();
    },
    
    testAddPut : function(test) {
        router.put('/homeput', this.testHandler);
        test.deepEqual(router.routes.PUT["/homeput"], this.testHandler); 
        test.done();
    }
}

