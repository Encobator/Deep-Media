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
    }
}
