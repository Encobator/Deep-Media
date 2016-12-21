var mysql = require("../module/mysql.js");

module.exports = {
    getAllReviews: function (callback) {
        mysql.query("SELECT `review`.`RUID`, `review`.`comment`, `review`.`date_time`, `review`.`points`, `user`.`avatar`, `user`.`nickname` FROM `review` INNER JOIN `user` ON `user`.`UUID` = `review`.`UUID` ORDER BY `review`.`date_time` DESC", {}, function (err, result) {
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
