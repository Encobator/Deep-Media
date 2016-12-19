/**
 *
 */

var schedule = require("node-schedule");
var tasks = require("../api/schedule.js");

module.exports = {
    set: function () {
        
        function scheduleTask(task) {
            schedule.scheduleJob(task.rule, function () {
                console.log("Scheduler Executing Task [" + task.name + "] at " + (new Date()).toString());
                task.action();
            });
        }
        
        for (var i = 0; i < tasks.length; i++) {
            scheduleTask(tasks[i]);
        }
    }
}
