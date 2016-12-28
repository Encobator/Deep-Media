var mysql = require("../module/mysql.js");

module.exports = {
    getAllCases: function (callback) {
        mysql.query("SELECT * FROM `v9_news` where `catid` = 11 OR `catid` = 21 OR `catid` = 24 OR `catid` = 25 OR `catid` = 26 OR `catid` = 27 OR `catid` = 29 OR `catid` = 30 OR `catid` = 31 OR `catid` = 32 ORDER BY `id` DESC", {}, function (err, result) {
            console.log(result);
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
