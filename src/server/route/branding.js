var Branding = require("../api/branding.js");
var User = require("../api/user.js");

module.exports = function (req, res, callback) {
  User.verify(req, res, function () {
    console.log("shit");
    callback({});
  });
    /*Branding.getAllCases(function (result) {
        callback({
            "events": result
        });
    });
    */
}
