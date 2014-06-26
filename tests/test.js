var assert = require('assert');
var router = require('../trout');
var request = require('request');
var events = require('events');
var http = require('http');
var testListenPort = 33333;
var testListenHost = "http://localhost:" + testListenPort;

var handler = function(req, res) {
        router.pass(req, res);
}
var testServer = http.createServer(handler);
testServer.listen(testListenPort);

var TestCounter = function(numExpectedTests) {
    this.completedTests = 0;
    this.numExpectedTests = numExpectedTests;
};

TestCounter.prototype = new events.EventEmitter;

TestCounter.prototype.increment = function() {
    if (this.completedTests < this.numExpectedTests) {
        this.completedTests += 1;
    }
    if (this.completedTests == this.numExpectedTests) {
        this.emit("completeTests");
    }
}


function WebTestTool(testCases, setupProcedure) {
    this.testCases = testCases;
    this.setupProcedure = setupProcedure;
    this.currentTestCase = "";
    this.currentSubCase = 1;
    this.numFailed = 0;
    this.numPassed = 0;
    this.requestCounter = new TestCounter(2);
    this.requestCounter.on("completeTests", this.summary);
}

WebTestTool.prototype.testRequest = function(method, url) {
    var _class = this;
    var methodMap = {
        "get": function(url) {
            request.get(testListenHost + url);
        }
    };
    methodMap[method](url);
};

WebTestTool.prototype.incrementSubCase = function() {
    this.currentSubCase += 1;
};

WebTestTool.prototype.resetSubCase = function() {
    this.currentSubCase = 0;
}

WebTestTool.prototype.testEqual = function(testValue, goodValue) {
    var _class = this;
    try {
        assert.equal(testValue, goodValue);
        this.numPassed += 1;
        console.log("\tCurrent test case: " + _class.currentTestCase + " SubCase: " + _class.currentSubCase);
    }
    catch (e) {
        this.numFailed += 1;
        console.log(e);
    }
    this.incrementSubCase();
    this.requestCounter.increment();
};

WebTestTool.prototype.testCurrentCase = function(queryCase) {
    this.testEqual(queryCase, this.currentTestCase);
}

WebTestTool.prototype.run = function() {
    var _class = this;
    this.setupProcedure();
    var testCases = this.testCases;
    for (testCase in testCases) {
        if (testCases.hasOwnProperty(testCase)) {
            testCases[testCase]();
            _class.currentTestCase = testCase;
            console.log("current test case is: " + testCase);
            _class.resetSubCase();
        }
    }
};

WebTestTool.prototype.summary = function() {
     console.log("Ran through all the testcases!");
};


var TroutTest = {
    clear: function() {
        for(method in router.routes) {
            console.log(router.routes);
            router.routes.method = {};
            console.log(router.routes);
        }
    },
     
    initHandlers : function() {
        var _class = this;
        router.get('/home/:name', function(req, res) {
            _class.testEqual(req.params.name, 'viktor');
            _class.testCurrentCase("single_param_match")
        });
    },
    
    /**
     *
     * @global testEngine
     */
    testCases : {
        single_param_match : function() {
            testEngine.testRequest("get", '/home/viktor');
            
        }
    },
}

var testEngine = new WebTestTool(TroutTest.testCases, TroutTest.initHandlers);






testEngine.run();