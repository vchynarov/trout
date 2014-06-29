var request = require('request');
var events = require('events');
var assert = require('assert');
var util = require('util');
var PASSED = true;
var FAILED = false;

var ColourPrint = {
    RED_FG: "\x1b[31m",
    RED_BG: "\x1b[41m",
    GREEN_FG: "\x1b[32m",
    GREEN_BG: "\x1b[42m",
    YELLOW_FG : "\x1b[33m",
    
    success: function(string) {
        this.printMessage(this.GREEN_FG, string);
    },
    
    testPassed : function(string) {
        this.printMessage(this.GREEN_BG, string);
    },
    
    testFailed : function(string) {
        this.printMessage(this.RED_BG, string);
    },
    
    error : function(string) {
        this.printMessage(this.RED_FG, "\t" + string);
    },
    
    errorDetails : function(string) {
        this.printMessage(this.YELLOW_FG, "\t" + string);
    },
    
    printMessage : function(COLOR, message) {
        var COLOUR_RESET = "\x1b[0m";
        var formattedString = util.format("%s%s%s", COLOR, message, COLOUR_RESET);
        console.log(formattedString);
    }
};

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
    this.testCount = 4;
    this.requestCounter = new TestCounter(this.testCount);
    this.requestCounter.on("completeTests", this.summary);
    this.host = host;
    /* We need to count the total number of test assertions and stuff made.
     *  This acts as a lock so the same methods can be used as counters.
     */
    this.TESTING_ACTIVE = false;
}

WebTestTool.prototype.printError = function(e) {
    var errorString = util.format("%s:  Expected: %s  Actual:  %s", e.name, e.expected, e.actual);
    stackString = new Error().stack;
    ColourPrint.error(errorString);
    ColourPrint.errorDetails(stackString.split("\n")[2])
}

WebTestTool.prototype.testRequest = function(method, url) {
    this.incrementSubCase();
    var _class = this;
    var methodMap = {
        "get": function(url) {
            request.get(_class.host + url);
        },
        "put": function(url) {
            request.put(_class.host + url);
        }
    };
    methodMap[method](url);
};

WebTestTool.prototype.incrementSubCase = function() {
    this.currentSubCase += 1;
};

WebTestTool.prototype.resetSubCase = function() {
    this.currentSubCase = 1;
}

WebTestTool.prototype.testEqual = function(testValue, goodValue, testCase, subCase) {
    var testStatus;
    var error = null;
    try {
        assert.equal(testValue, goodValue);
        testStatus = PASSED;
    }
    catch (e) {
        testStatus = FAILED;
        error = e;
    }
    var logString = util.format("(%s): %s", testCase, subCase);
    if (testStatus) {
        ColourPrint.success(logString);
    }
    else {
        ColourPrint.testFailed(logString);
        this.printError(error);
    }
    this.requestCounter.increment(testStatus);
};

WebTestTool.prototype.testCurrentCase = function(queryCase) {
    this.testEqual(queryCase, this.currentTestCase);
}

WebTestTool.prototype.run = function() {
    var _class = this;
    this.setupProcedure();
    console.log("\nStarting Tests...\n");
    var testCases = this.testCases;
    for (testCase in testCases) {
        if (testCases.hasOwnProperty(testCase)) {
            testCases[testCase]();
        }
        _class.resetSubCase();
    }
};

WebTestTool.prototype.summary = function() {
     console.log("\n\nFinished running through test cases.");
     var statsString = util.format("Succesfully passed: %s/%s.", this.passedTests, this.totalTests);
     if ( this.passedTests != this.totalTests) {
        ColourPrint.error(statsString);
        process.exit(code=1);
     }
     else {
        ColourPrint.success(statsString);
             process.exit(code=0)
     }
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

TestCounter.prototype = new events.EventEmitter();

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