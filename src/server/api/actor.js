var file = require("../module/file.js");
var mysql = require("../module/mysql.js");
var User = require("./user.js");

module.exports = {
    getAllActors: function (callback) {
        mysql.query("SELECT `user`.`UUID`, `user`.`nickname`, `user`.`avatar`, `actor`.`name`, `actor`.`sex`, `actor`.`email`, `actor`.`phone`, `actor`.`role` FROM `actor` INNER JOIN `user` ON `user`.`UUID` = `actor`.`UUID`", {}, function (err, result) {
            if (err) {
                callback(null);
            }
            else {
                console.log(JSON.stringify(result));
                callback(result);
            }
        });
    },
    getInfo: function (UUID, callback) {
        mysql.query("SELECT `name`, `sex`, `email`, `phone`, `role`, `recommender`, `intro`, `image` FROM `actor` WHERE ?", {
            "UUID": UUID
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
    newActor: function (UUID, name, sex, email, phone, role, recommender, intro, image, callback) {
        var self = this;
        User.hasActorInfo(UUID, function (has) {
            if (!has) {
                self.saveImage(UUID, image, function (success) {
                    mysql.query("INSERT INTO `actor` SET ?", {
                        "UUID": UUID,
                        "name": name,
                        "sex": sex,
                        "email": email,
                        "phone": phone,
                        "role": role,
                        "recommender": recommender,
                        "intro": intro,
                        "image": "/img/user/" + UUID + ".jpg"
                    }, function (err, result) {
                        if (err) {
                            console.error("User ")
                            console.error(err);
                            self.removeImage(UUID);
                            callback(false);
                        }
                        else {
                            console.log("User " + UUID + " created his actor info");
                            callback(true);
                        }
                    });
                });
            }
            else {
                console.error("User " + UUID + " already have actor info");
                callback(false);
            }
        });
    },
    updateActor: function (UUID, name, sex, email, phone, role, recommender, intro, image, callback) {
        var self = this;
        User.hasActorInfo(UUID, function (has) {
            if (has) {
                self.saveImage(UUID, image, function (success, filename) {
                    mysql.query("UPDATE `actor` SET `name` = ?, `sex` = ?, `email` = ?, `phone` = ?, `role` = ?, `recommender` = ?, `intro` = ? WHERE `UUID` = ?", [
                        name,
                        sex,
                        email,
                        phone,
                        role,
                        recommender,
                        intro,
                        UUID
                    ], function (err, result) {
                        if (err) {
                            console.error("User " + UUID + " actor info edit failed");
                            console.error(err);
                            callback(false);
                        }
                        else {
                            console.log("User " + UUID + " edited his actor info");
                            callback(true);
                        }
                    });
                });
            }
            else {
                console.error("User " + UUID + " don't have his actor info yet");
                callback(false);
            }
        });
    },
    updateHasExperience: function (UUID, callback) {
        User.hasActorInfo(UUID, function (has) {
            if (has) {
                mysql.query("UPDATE `actor` SET `has_experience` = 1 WHERE ?", {
                    "UUID": UUID
                }, function (err, result) {
                    if (err) {
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            }
        });
    },
    applied: function (UUID, RUID, callback) {
        mysql.query("SELECT * FROM `application` WHERE `UUID` = ? AND `RUID` = ?", [
            UUID,
            RUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                if (result.length > 0) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }
        })
    },
    apply: function (UUID, RUID, time, recommender, comment, callback) {
        var self = this;
        User.hasActorInfo(UUID, function (has) {
            if (has) {
                self.applied(UUID, RUID, function (applied) {
                    if (!applied) {
                        mysql.query("INSERT INTO `application` SET `submit_date_time` = NOW(), `status` = 0, ", {
                            "UUID": UUID,
                            "RUID": RUID,
                            "time": time,
                            "recommender": recommender,
                            "comment": comment
                        }, function (err, result) {
                            if (err) {
                                callback(false);
                            }
                            else {
                                callback(true);
                            }
                        });
                    }
                    else {
                        callback(false);
                    }
                });
            }
            else {
                callback(false);
            }
        });
    },
    reviewingApplication: function (UUID, RUID, callback) {
        mysql.query("UPDATE `application` SET `status` = 1 WHERE `UUID` = ? AND `RUID` = ?", [
            UUID,
            RUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    rejectApplication: function (UUID, RUID, callback) {
        mysql.query("UPDATE `application` SET `status` = 2 WHERE `UUID` = ? AND `RUID` = ?", [
            UUID,
            RUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    admitApplication: function (UUID, RUID, callback) {
        mysql.query("UPDATE `application` SET `status` = 3 WHERE `UUID` = ? AND `RUID` = ?", [
            UUID,
            RUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    saveImage: function (UUID, image, callback) {
        if (!image || image == "") {
            callback(true);
        }
        
        file.saveImage("/user/" + UUID + ".jpg", image, callback);
    },
    removeImage: function (UUID) {
        file.removeImage("/user/" + UUID + ".jpg");
    }
}
