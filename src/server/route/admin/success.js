module.exports = function (req, res, callback) {
    var User = require("../../api/user.js");
    var Recruit = require("../../api/recruit.js");
    User.verify(req, res, function () {
       Recruit.updateActorStatus(req.query.a, 1, function(){
         res.redirect('back');
       });
    });
}
