# trout routing library for node.js #


Routing should be simple and semantic. Trout has a very easy
way to set up routes and route groupes. It provides different ways of 
setting route parameters in order to organize your URLs to explicitly 
define RESTful resources and collections. If your URL scheme is not
following REST intentionally, then it still allows simple definitions
of route parameters.


## Design considerations for trout ##

### Regular Expressions. ###

Regex is great but to us it should not belong in our URLs. 
Trout attempts to be as minimalistic yet semantic and logical as possible.
This should be a good balance.

### Change the default HTTP server listener. ###

trout is designed to be tiny and unintrusive so you can use it with
plain Node and it just adds a few attributes to the request object
simplifying development.


## Getting Started ##

**THIS IS AN EXTREMELY EARLY RELEASE NOT YET PACKAGED AS A NODE APP. 
  Please disregard this repository for use until it is available via NPM.**

### Sample Application ###
```
var http = require('http');
var trout = require('./trout');
var router = new trout.Trout();

router.get('/home/:name', function(req, res) {
     res.write("Hello there, " + req.params.name);
     res.end();
});

var handler = function(req, res) {
     router.pass(req, res);
};

var app = http.createServer(handler);
app.listen(8080);

```

## Powerful features ##

### RESTful parameter definitions ###
You can explicitly define parameters as part of a resource or a collection.
Of course if you get lazy or you don't necessarily need a RESTful approach to your application
you can just normal parameters.

 * ```/c:[collectionName]``` - Accessed by ```req.params.collections.[collectionName]```
 * ```/r:[resourceName]``` - Accessed by ```req.params.resources.[resourceName]```
 * ```/:[normalParameter]``` - Accessed by ```req.params.[resourceName]```
 
 
### Route Grouping ###
trout allows you to group routes together. In this example, you can add further paths
to urls starting with "marbles".

```
router.group('/marbles', function() {
    router.get('/r:marbleName', function(req, res) {
        res.write("Oooh I really like your " + req.params.resources.marbleName + " marble!");
        res.end();
    })
})
```

## Power of Trout ##
trout is designed for powerful semantic RESTful api development. Here's an example.

```
router.put('/home/:name/c:marbles/r:marbleName', function(req, res) {
   res.write("Oh hey, " + req.params.name + ". You added a: ");
   res.write(req.params.resources.marbleName + " to your " + req.params.collections.marbles + " marbles collection");
   res.end();
});
```

Sending a ```PUT``` request to ```http://localhost:8001/home/viktor/reds/shinyMarble``` returns:

```Oh hey, viktor. You added a: shinyMarble to your reds marbles collection```.
