module.exports = function (req, res, callback) {
  var User = require("../../api/user.js");
  var Recruit = require("../../api/recruit.js");
  Recruit.getRecruits(function (result) {
      callback({
          "recruits": result
      });
  });
}
