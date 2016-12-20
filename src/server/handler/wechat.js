var wechat = require("../api/wechat.js");
var xml2js = require("xml2js");

module.exports = {
    process: function (req, res) {
        if (req.method == "GET") {
            if (wechat.verify(req.query["signature"], req.query["timestamp"], req.query["nonce"])) {
                res.write(req.query["echostr"]);
            }
            res.end();
        }
        else if (req.method == "POST") {
            var data = xml2js.parse(req.body);
            switch (data.event) {
                case "text":
                case "subscribe": break;
                case "button":
                    switch (data.key) {
                        case
                    }
            }
        }
        else {
            res.end();
        }
    }
}
