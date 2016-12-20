
var request = require("request");
var util = require("./util.js");
var config = require("../data/config.json");

module.exports = {
    hasAccessToken: false,
    accessToken: undefined,
    logTime: undefined,
    expiresIn: undefined,
    initiate: function () {
        this.refreshAccessToken();
    },
    refreshAccessToken: function () {
        var self = this;
        this.requestToken("client_credential", function (data) {
            self.logTime = new Date();
            self.hasAccessToken = true;
            self.accessToken = data["access_token"];
            self.expiresIn = data["expires_in"];
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
