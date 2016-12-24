var Wechat = require("./wechat.js");
var crypto = require("../module/crypto.js");
var util = require("../module/util.js");
var mysql = require("../module/mysql.js");
var TimeSpan = require("../module/timespan.js");

module.exports = {
    DEFAULT_PASSWORD: "12345678",
    getUUID: function (openId, callback) {
        mysql.query("SELECT `UUID` FROM `user` WHERE ?", {
            "openId": openId,
        }, function (err, result) {
            if (err) {
                callback(null);
            }
            else {
                if (result.length > 0) {
                    callback(result[0]["UUID"]);
                }
                else {
                    callback(null);
                }
            }
        });
    },
    getUserInfoByUUID: function (UUID, callback) {
        mysql.query("SELECT * FROM `user` WHERE ?", {
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
        })
    },
    getUserInfoByOpenId: function (openId, callback) {
        mysql.query("SELECT * FROM `user` WHERE ?", {
            "openId": openId
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
    newUser: function (openId, callback) {
        console.log("Attempting to create user with open-id " + openId);
        Wechat.getUserInfo(openId, function (info) {
            console.log("\tGet user info: ");
            console.log("\t" + info);
            mysql.query("INSERT INTO `user` SET `UUID` = UUID(), `register_time` = NOW(), `is_admin` = 0, ?", {
                "openId": openId,
                "nickname": info["nickname"],
                "avatar": info["headimgurl"]
            }, function (err, result) {
                if (err) {
                    callback(false);
                }
                else {
                    callback(info);
                }
            });
        });
    },
    existUUID: function (UUID, callback) {
        mysql.query("SELECT `id` FROM `user` WHERE `UUID` = ?", [
            UUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result.length > 0);
            }
        });
    },
    existOpenId: function (openId, callback) {
        mysql.query("SELECT `id` FROM `user` WHERE `openId` = ?", [
            openId
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result.length > 0);
            }
        });
    },
    existsUsername: function (username, callback) {
        mysql.query("SELECT * FROM `user` WHERE `username` = ?", [
            username
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result.length > 0);
            }
        });
    },
    hasActorInfo: function (UUID, callback) {
        mysql.query("SELECT * FROM `actor` WHERE `UUID` = ?", [
            UUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result.length > 0);
            }
        });
    },
    isAdmin: function (UUID, callback) {
        mysql.query("SELECT `is_admin` FROM `user` WHERE `UUID` = ?", [
            UUID
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(result[0]["is_admin"] == 1);
            }
        })
    },
    newAdmin: function (UUID, username, callback) {
        var self = this;
        this.existsUUID(UUID, function (exists) {
            if (exists) {
                self.existsUsername(username, function (usernameExists) {
                    if (!usernameExists) {
                        var encoded = crypto.genEncrypted(self.DEFAULT_PASSWORD);
                        mysql.query("UPDATE `user` SET `is_admin` = 1, `username` = ?, `password` = ? WHERE `UUID` = ?", [
                            username,
                            encoded,
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
    removeAdmin: function (UUID, callback) {
        var self = this;
        this.existsUUID(UUID, function (exists) {
            if (exists) {
                mysql.query("UPDATE `user` SET `is_admin` = 0 WHERE `UUID` = ?", [
                    UUID
                ], function (err, result) {
                    if (err) {
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                })
            }
            else {
                callback(false);
            }
        });
    },
    verify: function (req, res, callback) {
        var self = this;
        this.loggedIn(req, function (logged) {
            if (logged) {
                callback();
            }
            else {
                console.log("User have not logged in. Redirecting to login page.");
                res.redirect("login.html");
            }
        });
    },
    loggedIn: function (req, callback) {
        var self = this;

        if (req.cookies.session) {

            mysql.query("SELECT * FROM `user` WHERE ?", {
                "session": req.cookies.session
            }, function (err, result) {
                if (!err) {
                    if (result.length > 0) {

                        //Calculate the expire time
                        var curr = (new Date()).getTime();
                        var start = Date.parse(result[0]["session_start"]);
                        var ts = new TimeSpan(curr - start);

                        if (ts.getHour() <= 1) {

                            //Update the session start time
                            self.updateSession(result[0]["username"], function (updated) {
                                if (updated) {
                                    callback(true);
                                }
                                else {
                                    callback(false);
                                }
                            });
                        }
                        else {
                            //The session has expired
                            callback(false);
                        }
                    }
                    else {
                        callback(false);
                    }
                }
                else {
                    callback(false);
                }
            });
        }
        else {
            callback(false);
        }
    },
    login: function (username, res, callback) {

        var self = this;
        var session = util.UUID();
        mysql.query("UPDATE `user` SET `session_start` = NOW(), ?", {
            "session": session
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                self.setSession(res, session);
                callback(true);
            }
        });
    },
    logout: function (username, callback) {
        this.clearSession(res);
    },
    setSession: function (res, session) {
        res.cookie("session", session, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });
    },
    updateSession: function (username, callback) {
        mysql.query("UPDATE `user` SET `session_start` = NOW() WHERE ?", {
            "username": username
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    checkPasswordWithSession: function (session, password, callback) {
        mysql.query("SELECT `password` FROM `user` WHERE ?", {
            "session": session
        }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                if (result.length == 0) {
                    callback(false);
                }
                else {
                    if (crypto.match(password, result[0]["password"])) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                }
            }
        })
    },
    changePassword: function (session, password, callback) {
        var encrypted = crypto.genEncrypted(password);
        mysql.query("UPDATE `user` SET `password` = ? WHERE `session` = ?", [
            encrypted,
            session
        ], function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    },
    isPassword: function (password) {
        return password.match(this.passwordRegex);
    },
    match: function (username, password, callback) {
        mysql.query("SELECT `password` FROM `user` WHERE `username` = ?", [
            username
        ], function (err, result) {
            if (err) {
                console.log(err);
                callback(3);
            }
            else {
                if (result.length > 0) {
                    if (crypto.match(password, result[0]["password"])) {
                        callback(0);
                    }
                    else {
                        callback(2);
                    }
                }
                else {
                    callback(1);
                }
            }
        })
    },
    getProjects: function (UUID, callback) {
        mysql.query("SELECT `PUID` FROM `project` WHERE ?", {
            "UUID": UUID
        }, function (err, result) {
            if (err) {
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
        })
    },
    sendProjectUpdate: function (PUID, callback) {

    },
    sendApplicationUpdate: function (UUID, RUID, callback) {

    }
}
