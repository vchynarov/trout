var assert = require('assert');
var TroutTest = {
    init: function() {
        var _class = this;
        this.router = require('../trout');
        this.request = require('request');
        var http = require('http');
        

        this.currentTestCase = 1;
        this.numFailed = 0;
        this.numPassed = 0;
        var handler = function(req, res) {
            _class.router.pass(req, res);
        }
        this.server = http.createServer(handler);
        this.server.listen(33333);
    },
    
    clear: function() {
        for(method in router.routes) {
            console.log(router.routes);
            router.routes.method = {};
            console.log(router.routes);
        }
    },
    
    testRequest: {
        HOST : 'http://localhost:33333',
        
        get : function(url) {
            TroutTest.request.get(this.HOST + url);
        }
    },
    
    initHandlers : function() {
        var _class = this;
        
        _class.router.get('/home/:name', function(req, res) {
            _class.testEqual(req.params.name, 'viktor');
        });
    },
    
    testEqual: function(testValue, goodValue) {
        try {
            assert.equal(testValue, goodValue);
            TroutTest.numPassed += 1;
        }
        catch (e) {
            this.numFailed += 1;
            console.log(e);
        }
        console.log("You passed: " + TroutTest.numPassed + " tests out of: " + (TroutTest.numFailed + TroutTest.numPassed) + " total.");
    },
    
    testCases : {

        single_param_match : function() {
            TroutTest.testRequest.get('/home/viktor')
        }
    },
    
    run : function() {
        var _class = this;
        _class.initHandlers();
        for (testCase in _class.testCases) {
            console.log(testCase);
            if (_class.testCases.hasOwnProperty(testCase)) {
                _class.testCases[testCase]();
                _class.currentTestCase += 1;
            }
        }

        
    }
}


TroutTest.init();
TroutTest.run();