var User = require("../api/user.js");
var Project = require("../api/project.js");
var mysql = require("../module/mysql.js");
var Recruit = require("../api/recruit.js");

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
    submit_project: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["PUID"] == "") {
                    Project.newProject(req.body["title"], req.body["status"], req.body["content"], req.body["date_time"], function (success) {
                        if (success) {
                            res.success({});
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
                else {
                    Project.projectExists(req.body["PUID"], function (exists) {
                        if (exists != undefined) {
                            if (exists) {
                                Project.updateProject(req.body["PUID"], req.body["title"], req.body["status"], req.body["date_time"], req.body["content"], function (success) {
                                    if (success) {
                                        res.success({});
                                    }
                                    else {
                                        res.error(1, "Database Error");
                                    }
                                });
                            }
                            else {
                                res.error(2, "No Such Article Exists");
                            }
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
            }
            else {
                res.error(1000, "please Login First");
            }
        });
    },
    submit_recruit: function (req, res) {
        User.loggedIn(req, function (logged) {
            console.log(req.body["RUID"]);
            if (logged) {
                if (req.body["RUID"] == "") {
                    Recruit.newRecruit(req.body["title"], req.body["status"], req.body["cover"], req.body["content"], req.body["date_time"], function (success) {
                        if (success) {
                            res.success({});
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
                else {
                    Recruit.recruitExists(req.body["RUID"], function (exists) {
                        if (exists != undefined) {
                            if (exists) {
                                Project.updateRecruit(req.body["RUID"], req.body["title"], req.body["status"], req.body["date_time"], req.body["cover"], req.body["content"], function (success) {
                                    if (success) {
                                        res.success({});
                                    }
                                    else {
                                        res.error(1, "Database Error");
                                    }
                                });
                            }
                            else {
                                res.error(2, "This Recruit Does not Exist");
                            }
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
            }
            else {
                res.error(1000, "please Login First");
            }
        });
    },
    /*
    get_project: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["content"] && req.body["content"] != "") {
                    Article.getAdminArticle(req.body["article"], function (result) {
                        if (result) {
                            res.success(result);
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    });
                }
                else {
                    res.error(1, "Project Id Required");
                }
            }
            else {
                res.error(1000, "Please Login First");
            }
        });
    },
    */
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
