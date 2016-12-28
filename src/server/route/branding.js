var Branding = require("../api/branding.js");
var User = require("../api/user.js");

module.exports = function (req, res, callback) {
    Branding.getAllCases(function (result) {
        callback({
            "events": result
        });
    });
}
