
var request = require("request");
var config = require("../data/config.json");

module.exports = {
    hasAccessToken: false,
    accessToken: undefined,
    logTime: undefined,
    expiresIn: undefined,
    refreshAccessToken: function () {
        var self = this;
        this.request("client_credential", function (data) {
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
    request: function (type, callback) {
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