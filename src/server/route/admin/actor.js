var User = require("../../api/user.js");
var Actor = require("../../api/actor.js");

module.exports = function (req, res, callback) {
    User.verify(req, res, function () {
        Actor.getAllActors(function (actors) {
            callback({
                "actors": actors
            });
        });
    });
}
