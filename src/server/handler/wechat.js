var Wechat = require("../api/wechat.js");
var User = require("../api/user.js");
var xml2js = require("xml2js");
var parseXml = require('xml2js').parseString;

module.exports = {
    process: function (req, res) {
        if (req.method == "GET") {
            if (Wechat.verify(req.query["signature"], req.query["timestamp"], req.query["nonce"])) {
                res.write(req.query["echostr"]);
            }
            res.end();
        }
        else if (req.method == "POST") {
            parseXml(req.body, function (err, result) {
                if (err) {
                    res.end();
                }
                else {
                    switch (result.MsgType) {
                    case "text":
                        var content = result.Content;
                        break;
                    case "event":
                        switch (result.Event) {
                        case "subscribe":
                            var openId = result.FromUserName;
                            User.newUser(openId, function (info) {
                                if (info) {
                                    res.write(info["nickname"] + "，感谢您的关注～您可以点击下方的菜单查看我们的原创作品");
                                }
                                res.end();
                            });
                            break;
                        case "unsubscribe":
                            res.end();
                            break;
                        case "CLICK":
                            switch (result.EventKey) {
                                case "": break;
                            }
                            break;
                        }
                        break;
                    }
                }
            });
        }
        else {
            res.end();
        }
    }
}
