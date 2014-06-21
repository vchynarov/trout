
var TroutTest = {
    init: function() {
        this.router = require('../trout');
        var http = require('http');

        
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
    
    tests: {
        singular_plain_match: {
            method: "get",
            path: '/home',
            run : function() {
                TroutTest.router[this.method](this.path, function(req, res) {
                    return true;
                })
                
                
                
            }
            
        }
    },
    
    run : function() {
        var test, testCase, testResult;
        for (test in this.tests) {
            if (this.tests.hasOwnProperty(test)) {
                testCase = this.tests[test];
                testResult = testCase.run();
                console.log(testResult);
            }
            //code
        }
    }
}

TroutTest.init();
TroutTest.run();