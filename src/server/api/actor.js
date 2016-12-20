var User = require("./user.js");

module.exports = {
    newActor: function (UUID, name, gender, email, phone, hasExperience, callback) {
        User.hasActorInfo(UUID, function (has) {
            if (!has) {
                mysql.query("INSERT INTO `actor` SET ?", {
                    "name": name,
                    "gender": gender,
                    "email": email,
                    "phone": phone,
                    "has_experience": hasExperience
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
        }, false);
    },
    updateActor: function (UUID, name, gender, email, phone, has_experience, callback) {
        User.hasActorInfo(UUID, function (has) {
            if (has) {
                mysql.query("UPDATE `actor` SET `name` = ?, `gender` = ?, `email` = ?, `phone` = ?, `has_experience` = ? WHERE ?", [
                    name,
                    gender,
                    email,
                    phone,
                    hasExperience,
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
