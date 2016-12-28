var User = require("./user.js");

module.exports = {
    getInfo: function (UUID, callback) {
        mysql.query("SELECT * FROM `actor`", function (err, result) {
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
        })
    },
    newActor: function (UUID, name, sex, email, phone, intro, image, callback) {
        User.hasActorInfo(UUID, function (has) {
            if (!has) {
                mysql.query("INSERT INTO `actor` SET ?", {
                    "UUID": UUID,
                    "name": name,
                    "sex": sex,
                    "email": email,
                    "phone": phone,
                    "intro": intro,
                    "image": image
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
    },
    updateActor: function (UUID, name, sex, email, phone, intro, image, callback) {
        User.hasActorInfo(UUID, function (has) {
            if (has) {
                mysql.query("UPDATE `actor` SET `name` = ?, `sex` = ?, `email` = ?, `phone` = ?, `intro` = ?, `image` = ? WHERE ?", [
                    name,
                    gender,
                    email,
                    phone,
                    intro,
                    image,
                    UUID
                ], function (err, result) {
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
        })
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
    }
}
