var User = require("../../api/user.js");
var Project = require("../../api/project.js");

module.exports = function (req, res, callback) {
    User.verify(req, res, function () {
        if (req.query["a"]) {
            Project.getProjects(function (projects) {
                Project.getProgress(req.query["a"], function (progress) {
                    callback({
                        "PUID": req.query["a"],
                        "projects": projects,
                        "progresses": progress
                    });
                });
            });
        }
        else {
            Project.getProjects(function (projects) {
                res.redirect("progress_manage.html?a=" + projects[0]["PUID"]);
            });
        }
    });
}
/*
var User = require("../../api/user.js");
User.verify(req, res, function () {
  callback({});
});
*/
