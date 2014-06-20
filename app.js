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

router.post('/home/:name/:book', function(req, res) {
   res.write("Oh hey, " + req.params.name + ". Nice to see you're still reading: " + req.params.book);
   res.end();
});

router.put('/home/:name/c:marbles/r:marbleName', function(req, res) {
   res.write("Oh hey, " + req.params.name + ". You added a: ");
   res.write(req.params.resources.marbleName + " to your " + req.params.collections.marbles + " marbles collection");
   res.end();
});

function handler(req, res) {
    router.pass(req, res);
}

var server = http.createServer(handler);
server.listen(8001);
