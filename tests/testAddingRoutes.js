var router = require('../src/trout');
var crypto = require('crypto');

testHandlerGenerator = function(token) {
        return new function(req, res) {
             this.token = token;
        }
    };
        
module.exports = {
    setUp : function(callback) {
        var crypter160 = crypto.createHash('ripemd160');
        // Allows test runner to ensure that handlers are the same created for every test.
        this.token = crypter160.update(Math.random().toString()).digest('hex');
        this.testHandler = function(req, res) {
            this.token = token;
        };

        callback();
    },
    
    tearDown : function(callback) {
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
    },
}

