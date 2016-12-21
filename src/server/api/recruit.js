var mysql = require("../module/mysql.js");

module.exports = {
    PAGE_PROJECT_AMOUNT: 10,
    getRecruitAmount: function (callback) {
        mysql.query("SELECT COUNT(`id`) AS `amount` FROM `recruit` WHERE `status` = 1", {}, function (err, result) {
            if (err) {
                callback(-1);
            }
            else {
                callback(result[0]["amount"]);
            }
        })
    },
    getRecruits: function (callback) {
        mysql.query("SELECT * FROM `recruit` ORDER BY `time` DESC", function (err, result) {
            if (err) {
                callback(undefined);
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
    },
    recruitExists: function (recruit, callback) {
        mysql.query("SELECT `id` FROM `recruit` WHERE ?", {
            "RUID": recruit
        }, function (err, result) {
            if (err) {
                callback(undefined);
            }
            else {
                if (result.length > 0) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }
        });
    },
    getRecruitInfo: function (RUID, callback) {
        mysql.query("SELECT * FROM `recruit` WHERE ?", {
            "RUID": RUID
        }, function (err, result) {
            if (err) {
                callback(null);
            }
            else {
                if (result.length > 0) {
                    callback(result[0]);
                }
                else {
                    callback(null);
                }
            }
        });
    },
    newRecruit: function (title, status, cover, description, startDateTime, callback) {
        mysql.query("INSERT INTO `recruit` SET `RUID` = UUID(), ?", {
            "title": title,
            "status": status,
            "cover": cover,
            "description": description,
            "time": startDateTime
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    updateRecruit: function (RUID, title, status, startDateTime, cover, description, callback) {
        mysql.query("UPDATE `recruit` SET `title` = ?, `status` = ?, `cover` = ?, `description` = ?, `time` = ? WHERE `RUID` = ?", [
            title,
            status,
            cover,
            description,
            startDateTime,
            RUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    }
}
