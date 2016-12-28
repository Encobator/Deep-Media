var News = require("../api/news.js");

module.exports = function (req, res, callback) {
    News.getAllNews(function (result) {
        callback({
            "events": result
        });
    });
}
