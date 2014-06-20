function Trout() {
    this.routes = {
        get  : {},
        post : {},
        put  : {},
        del  : {}
    }
}

Trout.prototype.get = function (route, callback) {
    this.routes.get[route] = callback;
};

Trout.prototype.post = function (route, callback) {
    this.routes.post[route] = callback;
};

Trout.prototype.put = function (route, callback) {
    this.routes.put[route] = callback;
};

Trout.prototype.del = function (route, callback) {
    this.routes.del[route] = callback;
};

Trout.prototype.errorPage404 = function (req, res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("You dun fucked up!");
    res.end();
};

/**
 * 
 * @param req
 * @param res
 * 
 */
Trout.prototype.pass = function (req, res) {
    // Need to breakup route delimits with question mark
    // to prevent parsing URL parameters
    var viewFunction = this.errorPage404;
    var routeParameters = {
        "g": {},
        "r": {},
        "c": {}
    };
    var methodMap = {
        "GET": "get",
        "POST": "post",
        "DELETE": "del",
        "PUT": "put"
    };
    var method = methodMap[req.method];
    matchedRoute = this.existsRoute(req.url, method);
    if (matchedRoute) {
        viewFunction = this.routes[method][matchedRoute.routeName];
        routeParameters = matchedRoute.routeParameters;
    }
    
    req = this.populateRequestParameters(req, routeParameters);
    viewFunction(req, res);
    //res.write('testing the passing functionality');
    //res.end();
};

Trout.prototype.populateRequestParameters = function (req, routeParameters) {
    var normalParameter, resourceParameter, collectionParameter;
    req.params = {
        resources: {},
        collections: {}
    };
    for (normalParameter in routeParameters.g) {
        req.params[normalParameter] = routeParameters.g[normalParameter];
    }
    for (resourceParameter in routeParameters.r) {
        req.params.resources[resourceParameter] = routeParameters.r[resourceParameter];
    }
    for (collectionParameter in routeParameters.c) {
        req.params.collections[collectionParameter] = routeParameters.c[collectionParameter];
    }
    return req;
};

/**
 * Returns the name of the route in the particular routeArray if
 * it is a succesful match, or false if it is not found in the particular array.
 *
 *
 */
Trout.prototype.existsRoute = function (passedRoute, method) {
    var routeNames = Object.keys(this.routes[method]);
    var length = routeNames.length;
    var i, routeName, validParameters, routeData;
    for (i = 0; i < length; i += 1) {
        routeName = routeNames[i];
        validParameters = this.getRouteParameters(passedRoute, routeName);
        if (validParameters) {
            routeData = {
                routeName : routeName,
                routeParameters : validParameters
            };
            return routeData;
        }
    }
    return false;
};

Trout.prototype.tokenize = function (routeString) {
    try {
        // Allows for having an optional backslash at the end of the URL.
        var noParamString = routeString.split("?")[0];
        var tokens = noParamString.split("/").splice(1);
        if (tokens[tokens.length - 1] === "") {
            tokens.pop();
        }
        return tokens;
    } catch (e) {
        console.log(e);
    }
};

/**
 * Returns true if a route passed in matches a particular saved route
 * when taking into account the parameter rules. 
 *
 */
Trout.prototype.getRouteParameters = function (passedRoute, savedRoute) {
    var passedTokens = this.tokenize(passedRoute);
    var savedTokens = this.tokenize(savedRoute);
    // First of all to check they are the same length
    var numTokens = savedTokens.length;
    if (passedTokens.length !== numTokens) {
        return false;
    }
    var parameters = {
        "g": {},
        "r": {},
        "c": {}
    };
    var i, currentPassedToken, currentSavedToken, parameterTokens, parameterTokensLength;
    var compareToken, parameterCategory, parameterName;
    for (i = 0; i < numTokens; i += 1) {
        currentPassedToken = passedTokens[i];
        currentSavedToken = savedTokens[i];
        parameterTokens = currentSavedToken.split(":");
        parameterTokensLength = parameterTokens.length;
        // The case when there's no parameter and it's a direct string comparison.
        if (parameterTokensLength === 1) {
            compareToken = parameterTokens[0];
            if (currentPassedToken !== compareToken) {
                return false;
            }
        }
        // Handles cases when there parameters.
        else if (parameterTokensLength === 2) {
            parameterCategory = parameterTokens[0];
            parameterName = parameterTokens[1];
            if (parameterCategory === "") {
                parameterCategory = "g";
            }           
            parameters[parameterCategory][parameterName] = currentPassedToken;
        }
    }
    return parameters;
};
module.exports.Trout = Trout;
