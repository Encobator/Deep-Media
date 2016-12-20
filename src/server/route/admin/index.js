var User = require("../../api/user.js");

module.exports = function (req, res, callback) {
  User.verify(req, function () {
    callback({});
  });
}
