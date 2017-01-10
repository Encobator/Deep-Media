var mysql = require("../module/mysql.js");
var Wechat = require("./wechat.js");

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
    getProjects: function (callback) {
        mysql.query("SELECT * FROM `project` ORDER BY `start_date_time` DESC", function (err, result) {
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
    projectExists: function (project, callback) {
        mysql.query("SELECT `id` FROM `project` WHERE ?", {
            "PUID": project
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
    newProject: function (title, status, description, startDateTime, callback) {
        mysql.query("INSERT INTO `project` SET `PUID` = UUID(), ?", {
            "title": title,
            "status": status,
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
    updateProject: function (PUID, title, status, startDateTime, description, callback) {
        mysql.query("UPDATE `project` SET `title` = ?, `status` = ?, `description` = ?, `start_date_time` = ? WHERE `PUID` = ?", [
            title,
            status,
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
    getProjectClient: function (PUID, callback) {
        mysql.query("SELECT `user`.`UUID`, `user`.`avatar`, `user`.`nickname` FROM `client` INNER JOIN `user` ON `user`.`UUID` = `client`.`UUID` WHERE `client`.`PUID` = ?", [
            PUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result);
            }
        });
    },
    hasClient: function (PUID, UUID, callback) {
        mysql.query("SELECT COUNT(`id`) AS `amount` FROM `client` WHERE `PUID` = ? AND `UUID` = ?", [
            PUID,
            UUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result[0]["amount"] > 0);
            }
        })
    },
    addProjectClient: function (PUID, UUID, callback) {
        mysql.query("INSERT INTO `client` SET ?", {
            "PUID": PUID,
            "UUID": UUID
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        })
    },
    deleteProjectClient: function (PUID, UUID, callback) {
        mysql.query("DELETE FROM `client` WHERE `PUID` = ? AND `UUID` = ?", [
            PUID,
            UUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        })
    },
    addProgress: function (PUID, title, content, callback) {
        var self = this;
        mysql.query("INSERT INTO `progress` SET `PPUID` = UUID(), `date_time` = NOW(), ?", {
            "PUID": PUID,
            "title": title,
            "content": content
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                mysql.query("SELECT `PPUID` FROM `progress` WHERE `id` = LAST_INSERT_ID()", {}, function (err, result) {
                    if (err || result.length == 0) {
                        callback(false);
                    }
                    else {
                        self.notifyClient(result[0]["PPUID"], function (success) {
                            callback(success);
                        });
                    }
                });
            }
        }, false);
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
        mysql.query("SELECT * FROM `progress` WHERE `PUID` = ? ORDER BY `date_time` DESC", [
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
        mysql.query("SELECT `progress`.`title` AS `status`, `progress`.`PUID`, `project`.`title` FROM `progress` INNER JOIN `project` ON `project`.`PUID` = `progress`.`PUID` WHERE `PPUID` = ?", [
            progressUID
        ], function (err, result) {
            if (err) {
                console.log(err);
                callback(false);
            }
            else {
                if (result.length == 0) {
                    console.log("No such progress");
                    callback(false);
                }
                else {
                    var progress = result[0];
                    mysql.query("SELECT `user`.`openId`, `user`.`nickname` FROM `client` INNER JOIN `user` ON `user`.`UUID` = `client`.`UUID` WHERE `client`.`PUID` = ?", [
                        progress["PUID"]
                    ], function (err, result) {
                        if (err) {
                            console.log(err);
                            callback(false);
                        }
                        else {
                            for (var i = 0; i < result.length; i++) {
                                Wechat.sendProgressTemplateMessage(
                                    result[i]["openId"],
                                    result[i]["nickname"],
                                    progress["PUID"],
                                    progress["title"],
                                    progress["status"]
                                );
                            }
                            callback(true);
                        }
                    });
                }
            }
        });
    }
}
