var wechat = require("../api/wechat.js");

module.exports = {
    process: function (req, res) {
        if (req.method == "GET") {
            
            console.log(req.query);
            
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
