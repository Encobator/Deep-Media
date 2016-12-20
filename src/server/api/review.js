module.exports = {
    /*
        [
            {
                RUID: "adsfasdfad",
                comment: "COMMENT",
                date_time: "2016-1-2 00:00:00",
                avartar: "http://"
            }
        ]
     */
    getAllReviews: function (callback) {
        mysql.query("SELECT `review`.`RUID`, `review`.`comment`, `review`.`date_time`, `user`.`avartar`, `user`.`nickname` WHERE `user`.`UUID` = `review`.`UUID`", {}, function (err, result) {
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
