var crypto = require('crypto');

/*
 * Important notes on functional equality. Two functions that do not point to the
 * same place in memory, EVEN IF THEY HAVE the exact same values, are NOT THE SAME.
 *
 * In that case, you should test the output / return value of two "same"
 * testHandlers to verify they are essentially the same.
 *
 */
var testHandlerGenerator = function(token) {
    var testHandler = function(req, res) {
        console.log(token);
        return token;
    };
    return testHandler;
};

/**
 * Creates a token that is used to identify different
 * mock handlers.
 *
 * @return {String} token
 */
var createToken = function() {
    var crypter160 = crypto.createHash('ripemd160');
    // Allows test runner to ensure that handlers are the same created for every test.
    var token = crypter160.update(Math.random().toString()).digest('hex');
    return token;
}

/** 
 * Resets the router's routes. Essentially ensuring it is brand new
 *
 * Requires a global router object.
 *
 * @global router
 */
var resetRouter = function() {
    router.routes.GET = {};
    router.routes.POST = {};
    router.routes.DELETE = {};
    router.routes.PUT = {}; 
}

module.exports.testHandlerGenerator = testHandlerGenerator;
module.exports.createToken = createToken;
module.exports.resetRouter = resetRouter;