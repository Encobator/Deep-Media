var mysql = require("../../module/mysql.js");
var User = require("../../api/user.js");

module.exports = function (req, res, callback) {
    User.verify(req, res, function () {
        Review.getAllReviews(function (reviews) {
            callback({
                "reviews": reviews
            });
        });
    });
}
