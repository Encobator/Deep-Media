module.exports = {
    PAGE_PROJECT_AMOUNT: 10,
    getProjectAmount: function (callback) {
        mysql.query("SELECT COUNT(`id`) AS `amount` FROM `project` WHERE `status` = 1", {}, function (err, result) {
            if (err) {
                callback(-1);
            }
            else {
                callback(result[0]["amount"]);
            }
        })
    },
    getProjects: function (start, callback) {
        mysql.query("SELECT * FROM `project` WHERE `status` = 1 LIMIT " + start + this.PAGE_PROJECT_AMOUNT, function (err, result) {
            
        });
    },
    getProjectInfo: function (PUID, callback) {
        mysql.query("SELECT * FROM `project` WHERE ?", {
            "PUID": PUID
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                if (result.length > 0) {
                    callback(result[0]);
                }
                else {
                    callback(false);
                }
            }
        });
    },
    newProject: function (UUID, title, subtitle, description, startDateTime, callback) {
        mysql.query("INSERT INTO `project` SET `PUID` = UUID(), ?", {
            "title": title,
            "subtitle": subtitle,
            "description": description,
            "start_date_time": startDateTime
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    updateProject: function (PUID, title, description, startDateTime, callback) {
        mysql.query("UPDATE `project` SET `title` = ?, `description` = ?, `start_date_time` = ? WHERE `PUID` = ?", [
            title,
            subtitle,
            description,
            startDateTime,
            PUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    showProject: function (PUID, callback) {
        
    },
    hideProject: function (PUID, callback) {
        
    },
    hasClient: function (PUID, callback) {
        this.clientAmount(PUID, function (amount) {
            return amount > 0;
        });
    },
    clientAmount: function (PUID, callback) {
        mysql.query("SELECT COUNT(`id`) AS `amount` FROM `client` WHERE `PUID` = ?", [
            PUID
        ], function (err, result) {
            if (err) {
                callback(-1);
            }
            else {
                callback(result[0]["amount"]);
            }
        })
    },
    hasRecruit: function (PUID, callback) {
        
    },
    addRecruit: function (PUID, title, description, address, time, salary, callback) {
        
    },
    addProgress: function (project, title, description, callback) {
        mysql.query("INSERT INTO `progress` SET `PUID` = UUID(), `date_time` = NOW(), ")
    },
    deleteProgress: function (PUID, callback) {
        mysql.query("DELETE FROM `progress` WHERE `PUID` = ?", [
            PUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    getProgress: function (PUID, callback) {
        mysql.query("SELECT * FROM `progress` WHERE `PUID` = ?", [
            PUID
        ], function (err, result) {
            if (err) {
                callback(null);
            }
            else {
                callback(result);
            }
        })
    },
    notifyClient: function (progressUID, callback) {
        
    }
}
