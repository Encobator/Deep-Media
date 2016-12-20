module.exports = function (req, res, callback) {
    var User = require("../../api/user.js");
    User.verify(req, res, function () {
        callback({});
    });
}
