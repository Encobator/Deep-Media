var User = require("../../api/user.js");
var Recruit = require("../../api/recruit.js");

module.exports = function (req, res, callback) {
    User.verify(req, res, function () {
        if (req.query["a"]) {
            Recruit.getRecruits(function (recruits) {
                Recruit.getActors(req.query["a"], function (actors) {
                    callback({
                        "RUID": req.query["a"],
                        "recruits": recruits,
                        "actors": actors
                    });
                });
            });
        }
        else {
            Recruit.getRecruits(function (recruits) {
                res.redirect("actor_manage.html?a=" + recruits[0]["RUID"]);
            });
        }
    });
}
