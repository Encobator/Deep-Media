var mysql = require("../module/mysql.js");

module.exports = {
    getAllNews: function (callback) {
        mysql.query("SELECT * FROM `v9_news`", {}, function (err, result) {
            if (err) {
                console.log(err);
                callback(null);
            }
            else {
                if (result.length > 0) {
                    callback(result);
                }
                else {
                    callback(null);
                }
            }
        });
    }
}
