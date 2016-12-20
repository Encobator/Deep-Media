var User = require("../../api/user.js");
var Review = require("../../api/review.js");

module.exports = function (req, res, callback) {
    User.verify(req, res, function () {
        Review.getAllReviews(function (result) {
            callback({
                "reviews": result
            });
        });
    });
}
