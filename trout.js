function Trout() {
    this.getRoutes = {};
    this.getPaths = [];
    this.postRoutes = {};
    this.postPaths = [];
    
}

Trout.prototype.get = function(route, callback) {
    this.getPaths.push(route);
    this.getRoutes[route] = callback;
}

Trout.prototype.post = function(route, callback) {
    this.postPaths.push(route);
    this.postRoutes[route] = callback;
}

Trout.prototype.errorPage404 = function(req, res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("You dun fucked up!");
    res.end();
}
/**
 * 
 * @param req
 * @param res
 * 
 */
Trout.prototype.pass = function(req, res) {
    console.log(req.method);
    // Need to breakup route delimits with question mark
    // to prevent parsing URL parameters
    var viewFunction = this.errorPage404;
    var routeParameters = {
        "g": {},
        "r": {},
        "c": {}
    };
    
    switch(req.method) {
        case ("GET") : {
            var matchedRoute = this.existsRoute( req.url, "getRoutes" );
            if(matchedRoute) {
                viewFunction = this.getRoutes[matchedRoute.routeName];
                routeParameters = matchedRoute.routeParameters; 
            };
            break;
        }
        
        case "POST" : {
            console.log("is POST request");
            break;
        }
    }
    
    req = this.populateRequestParameters(req, routeParameters);
    viewFunction(req, res);
    //res.write('testing the passing functionality');
    //res.end();
}

Trout.prototype.populateRequestParameters = function(req, routeParameters) {
    req.params = {
        resources: {},
        collections: {}
    };
    
    for(normalParameter in routeParameters['g']) {
        req.params[normalParameter] = routeParameters['g'][normalParameter];
    }
    
    for(resourceParameter in routeParameters['r']) {
        req.params.resources[resourceParameter] = routeParameters['r'][resourceParameter]; 
    }
    
    for(collectionParameter in routeParameters['c']) {
        req.params.collections[collectionParameter] = routeParameters['c'][collectionParameter];
    }
    return req;
}

/**
 * Returns the name of the route in the particular routeArray if
 * it is a succesful match, or false if it is not found in the particular array.
 *
 *
 */
Trout.prototype.existsRoute = function( passedRoute, routeArray) {
    var routeNames = Object.keys(this[routeArray]);
    var length = routeNames.length;

    for(var i=0; i<length; i++) {

        var routeName = routeNames[i];
        var validParameters = this.getRouteParameters(passedRoute, routeName );
        if(validParameters ) {
            var routeData = {
                routeName : routeName,
                routeParameters : validParameters
            }
            return routeData;
        }
    }
    return false;  
}

Trout.prototype.tokenize = function(routeString) {
    try {
        // Allows for having an optional backslash at the end of the URL.
        var tokens = routeString.split("/").splice(1);
        if (tokens[tokens.length - 1] == "") {
            tokens.pop();
        }
        return tokens;
    } catch(e) {
        console.log(e);
    }
}

/**
 * Returns true if a route passed in matches a particular saved route
 * when taking into account the parameter rules. 
 *
 */
Trout.prototype.getRouteParameters = function( passedRoute, savedRoute) {
    var passedTokens = this.tokenize(passedRoute);
    var savedTokens = this.tokenize(savedRoute);
    
    // First of all to check they are the same length
    var numTokens = savedTokens.length;
    if (passedTokens.length != numTokens) {
        return false;
    }
    
    var parameters = {
        "g": {},
        "r": {},
        "c": {}
    };
    
    for(var i=0; i<numTokens; i++) {
        var currentPassedToken = passedTokens[i];
        var currentSavedToken = savedTokens[i];
        var parameterTokens = currentSavedToken.split(":");
        
        var parameterTokensLength = parameterTokens.length;
        
        // The case when there's no parameter and it's a direct string comparison.
        if (parameterTokensLength == 1) {
            var compareToken = parameterTokens[0];
            if (currentPassedToken != compareToken) {
                return false;
            }
        }
        
        // Handles cases when there parameters.
        else if (parameterTokensLength == 2) {
            var parameterCategory = parameterTokens[0];
            var parameterName = parameterTokens[1];
            
            if (parameterCategory == "") {
                parameterCategory = "g";
            }           
            parameters[parameterCategory][parameterName] = currentPassedToken;
        }
    }
    return parameters;
}

module.exports.Trout = Trout
