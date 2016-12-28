var mysql_news = require("../module/mysql_news.js");
module.exports = function (req, res, callback) {
  var User = require("../../api/user.js");
  User.verify(req, res, function () {
    callback({});
  });
}
