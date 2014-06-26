var request = require('request');
var events = require('events');
var assert = require('assert');
var PASSED = true;
var FAILED = false;

/**
 * WebTestTool for fun and magic.
 *
 *
 *
 *
 */
function WebTestTool(testCases, setupProcedure, host) {
    this.testCases = testCases;
    this.setupProcedure = setupProcedure;
    this.currentTestCase = "";
    this.currentSubCase = 1;
    this.numFailed = 0;
    this.numPassed = 0;
    this.requestCounter = new TestCounter(2);
    this.requestCounter.on("completeTests", this.summary);
    this.host = host;
}

WebTestTool.prototype.testRequest = function(method, url) {
    var _class = this;
    var methodMap = {
        "get": function(url) {
            request.get(_class.host + url);
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
    var testStatus;
    try {
        assert.equal(testValue, goodValue);
        testStatus = PASSED;
        console.log("\tCurrent test case: " + _class.currentTestCase + " SubCase: " + _class.currentSubCase);
    }
    catch (e) {
        testStatus = FAILED;
        console.log(e);
    }
    this.incrementSubCase();
    this.requestCounter.increment(testStatus);
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
    console.log(this);
     console.log("Ran through all the testcases!");
     console.log("Succesfully passed: " + this.passedTests + "/" + this.totalTests);
};


/*
 * TestCounter Object for Asynchronous Request Stuff
 */
var TestCounter = function(totalTests) {
    this.completedTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.totalTests = totalTests;
};

TestCounter.prototype = new events.EventEmitter;

TestCounter.prototype.increment = function(testStatus) {
    if (testStatus) {
        this.passedTests += 1;
    }
    else {
        this.failedTests += 1;
    }
    if (this.completedTests < this.totalTests) {
        this.completedTests += 1;
    }
    if (this.completedTests == this.totalTests) {
        this.emit("completeTests");
    }
}

module.exports.WebTestTool = WebTestTool;
module.exports.TestCounter = TestCounter;