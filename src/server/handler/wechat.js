var wechat = require("../api/wechat.js");
var config = require("../data/config.json");

module.exports = {
    process: function (req, res) {
        if (req.method == "GET") {
            if (wechat.verify(req.query["signature"], req.query["timestamp"], req.query["nonce"])) {
                res.write(req.query["echostr"]);
            }
            res.end();
        }
        else if (req.method == "POST") {
            res.end();
        }
        else {
            res.end();
        }
    }
}
