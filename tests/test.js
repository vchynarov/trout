var router = require('../trout');
var http = require('http');
var testtools = require('./testtools');
var LISTEN_PORT = 33333;
var LISTEN_HOST = "http://localhost:" + LISTEN_PORT;

var handler = function(req, res) {
        router.pass(req, res);
}
var testServer = http.createServer(handler);
testServer.listen(LISTEN_PORT);


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
        var currentCase;
        router.get('/home/:name', function(req, res) {
            currentCase = "single_params_match";
            _class.testEqual(req.params.name, 'viktor', currentCase, "name is Viktor");
            res.end();
        });
        
        router.put('/home/:name/c:marbles/r:marbleName', function(req, res) {
            currentCase = "marble_test";
            _class.testEqual(req.params.name, 'robert', currentCase, "name is Robert");
            _class.testEqual(req.params.collections.marbles, 'reds', currentCase, "red marble collection");
            _class.testEqual(req.params.resources.marbleName, 'the-shiny-marble', currentCase, "shiny marble!");
            res.end();
        });
    },
    
    /**
     *
     * @global testEngine
     */
    testCases : {
        single_param_match : function() {
            testEngine.testRequest("get", '/home/viktor');
        },
        
        marble_test : function() {
            testEngine.testRequest("put", "/home/robert/reds/the-shiny-marble");
        }
    },
}

var testEngine = new testtools.WebTestTool(TroutTest.testCases, TroutTest.initHandlers, LISTEN_HOST);
testEngine.run();