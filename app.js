var http = require('http');
var trout = require('./trout');

var router = new trout.Trout();

router.get('/home', function(req, res) {
    res.write('YOU ARE HOME');
    res.end();
});

router.get('/home/:name', function(req, res) {
   res.write("Welcome to your home page, " + req.params.name);
   res.end();
    
});

function handler(req, res) {
    router.pass(req, res);
}

var server = http.createServer(handler);
server.listen(8001);
