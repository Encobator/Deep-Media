var User = require("../api/user.js");

module.exports = {
    login: function (req, res) {
        User.match(req.body["username"], req.body["password"], function (result) {
            if (result == 0) {
                User.login(req.body["username"], res, function (logged) {
                    if (logged) {
                        console.log("User " + req.body["username"] + " now logged in the admin system. ");
                        res.success({});
                    }
                    else {
                        res.error(4, "Session Log Error");
                    }
                });
            }
            else if (result == 1) {
                res.error(1, "No Such User");
            }
            else if (result == 2) {
                res.error(2, "Incorrect Password");
            }
            else {
                res.error(3, "System Error");
            }
        });
    },
    logout: function (req, res) {
        User.logout(res);
        res.success({});
    },
    change_password: function (req, res) {
        if (User.isPassword(req.body["new"])) {
            User.loggedIn(req, function (logged) {
                if (logged) {
                    User.checkPasswordWithSession(req.cookies["session"], req.body["original"], function (correct) {
                        if (correct) {
                            User.changePassword(req.cookies["session"], req.body["new"], function (result) {
                                if (result) {
                                    res.success({});
                                }
                                else {
                                    res.error(4, "Database Error");
                                }
                            });
                        }
                        else {
                            res.error(3, "Your Password Is Incorrect");
                        }
                    });
                }
                else {
                    res.error(2, "You Have Not Logged In Yet!");
                }
            });
        }
        else {
            res.error(1, "The Password Does Not Satisfy the Requirement");
        }
    }
}
