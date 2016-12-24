
var request = require("request");
var util = require("./util.js");
var config = require("../data/config.json");

module.exports = {
    hasAccessToken: false,
    accessToken: undefined,
    logTime: undefined,
    expiresIn: undefined,
    menu: [
        {
            "type": "click",
            "name": "案例展示"
        },
        {
            "name": "深度视界",
            "sub_button": [
                {
                    "type": "click",
                    "key": "click_news",
                    "name": "最新动态"
                },
                {
                    "type": "view",
                    "name": "历史推文",
                    "url": "http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MjM5NDE2NzYxOQ==&from=1#wechat_webview_type=1&wechat_redirect"
                },
                {
                    "type": "click",
                    "key": "click_about",
                    "name": "关于我们"
                },
                {
                    "type": "click",
                    "key": "click_join",
                    "name": "加入我们"
                }
            ]
        },
        {
            "name": "我",
            "sub_button": [
                {
                    "type": "click",
                    "key": "click_info",
                    "name": "我的信息"
                },
                {
                    "type": "click",
                    "key": "click_apply",
                    "name": "演员报名"
                },
                {
                    "type": "click",
                    "key": "click_project",
                    "name": "查看项目"
                }
            ]
        }
    ],
    initiate: function () {
        var self = this;
        this.refreshAccessToken(function () {
            self.initiateMenu();
        });
    },
    refreshAccessToken: function (next) {
        var self = this;
        this.requestToken("client_credential", function (data) {
            self.logTime = new Date();
            self.hasAccessToken = true;
            self.accessToken = data["access_token"];
            self.expiresIn = data["expires_in"];
            next();
        });
    },
    hasAccessToken: function () {
        return this.hasAccessToken;
    },
    getAccessToken: function () {
        return this.accessToken;
    },
    verify: function (signature, timestamp, nonce) {

        //Check if all exist
        if (!signature || !timestamp || !nonce) {
            return false;
        }

        //Check signature
        var genSignature = util.signature(config["wechat_token"], timestamp, nonce);
        if (signature == genSignature) {
            return true;
        }
        else {
            return false;
        }
    },
    initiateMenu: function () {
        request({
            url: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + this.accessToken,
            form: this.menu
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if (data["errcode"] != 0) {
                    console.log(JSON.stringify(data));
                }
                else {
                    console.log("Successfully initiated wechat menu");
                }
            }
            else {
                throw new Error((new Date()).toString() + " - Error when initiating menu." + JSON.stringify(error));
            }
        });
    },
    getUserInfo: function (openId, callback) {
        var url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + this.accessToken + "&openid=" + openId + "&lang=zh_CN";
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                callback(data);
            }
            else {
                throw new Error("Error: " + (new Date()).toString() + " - Error when requesting wechat user " + openId + ".");
                console.log(error);
            }
        });
    },
    requestToken: function (type, callback) {
        var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=" + type + "&appid=" + config["wechat_appid"] + "&secret=" + config["wechat_appsecret"];
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            }
            else {
                throw new Error("Error: " + (new Date()).toString() + " - Error when requesting wechat " + type + ".");
                console.log(error);
            }
        });
    }
}

module.exports.initiate();
