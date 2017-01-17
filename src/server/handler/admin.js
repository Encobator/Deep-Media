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
                    Project.newProject(req.body["title"], req.body["status"], req.body["description"], req.body["date_time"], function (success) {
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
                                Project.updateProject(req.body["PUID"], req.body["title"], req.body["status"], req.body["date_time"], req.body["description"], function (success) {
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
    get_project_client: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["PUID"]) {
                    Project.getProjectClient(req.body["PUID"], function (clients) {
                        if (clients) {
                            res.success(clients)
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    })
                }
                else {
                    res.error(1, "Must specify PUID and UUID");
                }
            }
            else {
                res.error(1000, "please Login First");
            }
        });
    },
    add_project_client: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                console.log(JSON.stringify(req.body));
                if (req.body["PUID"] && req.body["UUID"]) {
                    Project.hasClient(req.body["PUID"], req.body["UUID"], function (has) {
                        if (!has) {
                            Project.addProjectClient(req.body["PUID"], req.body["UUID"], function (success) {
                                if (success) {
                                    res.success({});
                                }
                                else {
                                    res.error(3, "Add User Error");
                                }
                            })
                        }
                        else {
                            res.error(2, "This project has already have this user as client");
                        }
                    });
                }
                else {
                    res.error(1, "Must specify PUID and UUID");
                }
            }
            else {
                res.error(1000, "please Login First");
            }
        })
    },
    delete_project_client: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["PUID"] && req.body["UUID"]) {
                    Project.hasClient(req.body["PUID"], req.body["UUID"], function (has) {
                        if (has) {
                            Project.deleteProjectClient(req.body["PUID"], req.body["UUID"], function (success) {
                                if (success) {
                                    res.success({});
                                }
                                else {
                                    res.error(3, "Delete Project Admin Failed");
                                }
                            });
                        }
                        else {
                            res.error(2, "This user is not a client of this project");
                        }
                    });
                }
                else {
                    res.error(1, "Must specify PUID and UUID");
                }
            }
            else {
                res.error(1000, "Please Login First");
            }
        })
    },
    search_user: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["nickname"]) {
                    User.searchUser(req.body["nickname"], function (result) {
                        if (result) {
                            res.success(result);
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    });
                }
                else {
                    res.error(1, "Must Specify Nickname");
                }
            }
            else {
                res.error(1000, "Please login first");
            }
        });
    },
    submit_recruit: function (req, res) {
        User.loggedIn(req, function (logged) {
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
                                Recruit.updateRecruit(req.body["RUID"], req.body["title"], req.body["status"], req.body["date_time"], req.body["cover"], req.body["content"], function (success) {
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
    get_project: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["project"] && req.body["project"] != "") {
                    Project.getProjectInfo(req.body["project"], function (result) {
                        if (result) {
                            res.success(result);
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    })
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
    get_recruit: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["recruit"] && req.body["recruit"] != "") {
                    Recruit.getRecruitInfo(req.body["recruit"], function (result) {
                        if (result) {
                            res.success(result);
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    })
                }
                else {
                    res.error(1, "Recruit Id Required");
                }
            }
            else {
                res.error(1000, "Please Login First");
            }
        });
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
    },
    add_progress: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["PUID"] && req.body["title"], req.body["content"]) {
                    Project.addProgress(req.body["PUID"], req.body["title"], req.body["content"], function (success) {
                        if (success) {
                            res.success({});
                        }
                        else {
                            res.error(2, "Add Progress Failed");
                        }
                    })
                }
                else {
                    res.error(1, "Must specify PUID, title and content");
                }
            }
            else {
                res.error(1000, "You must login first");
            }
        })
    },
    get_actor_info: function (req, res) {
        User.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["UUID"]) {
                    User.getUserInfoByUUID(req.body["UUID"], function (info) {
                        if (info) {
                            User.hasActorInfo(info["UUID"], function (has) {
                                if (has) {
                                    Actor.getInfo(info["UUID"], function (actor) {
                                        if (actor) {
                                            for (var i in actor) {
                                                info[i] = actor[i];
                                            }
                                            res.success(info);
                                        }
                                        else {
                                            res.error(4, "Database error on actor info");
                                        }
                                    })
                                }
                                else {
                                    res.error(-1, "No Actor Information");
                                }
                            })
                        }
                        else {
                            res.error(3, "Database error on UUID");
                        }
                    });
                }
                else {
                    res.error(1, "Must specify UUID");
                }
            }
            else {
                res.error(1000, "You must login first");
            }
        });
    },
}
