var Branding = require("../api/branding.js");

module.exports = function (req, res, callback) {
    Branding.getAllCases(function (result) {
        callback({
            "events": result
        });
    });
}
