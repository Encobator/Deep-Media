
var request = require("request");
var util = require("./util.js");
var config = require("../data/config.json");

function generateUri(page) {
    return config["base_uri"] + page + ".html";
}

function generateWechatRedirectURI(uri) {
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config["wechat_appid"] + "&redirect_uri=" + encodeURIComponent(uri) + "&response_type=code&scope=snsapi_base#wechat_redirect";
    return url;
}

module.exports = {
    templateUrl: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=",
    progressTemplateId: "D0YxV7VYxaNT0EslCqr1EneCRBO1qcTwHN76lWcEVyo",
    applyTemplateId: "-TXRfVA3ur-ZnCLr3f7nj-bVEf2MBlnDSy-r_NcTVyI",
    hasAccessToken: false,
    accessToken: undefined,
    logTime: undefined,
    expiresIn: undefined,
    menu: {
        "button": [
            {
                "type": "view",
                "name": "案例展示",
                "url": generateUri("branding")
            },
            {
                "name": "深度视界",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "最新动态",
                        "url": generateUri("news")
                    },
                    {
                        "type": "view",
                        "name": "历史推文",
                        "url": "http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MjM5NDE2NzYxOQ==&from=1#wechat_webview_type=1&wechat_redirect"
                    },
                    {
                        "type": "view",
                        "name": "关于我们",
                        "url": generateUri("about")
                    },
                    {
                        "type": "view",
                        "name": "加入我们",
                        "url": generateUri("join")
                    }
                ]
            },
            {
                "name": "我",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "我的信息",
                        "url": generateWechatRedirectURI(generateUri("info"))
                    },
                    {
                        "type": "view",
                        "name": "演员报名",
                        "url": generateWechatRedirectURI(generateUri("apply"))
                    },
                    {
                        "type": "view",
                        "name": "查看项目",
                        "url": generateWechatRedirectURI(generateUri("project"))
                    }
                ]
            }
        ]
    },
    initiate: function () {
        var self = this;
        this.refreshAccessToken(function () {
            self.initiateMenu();
            // self.initiatePastUsers();
        });
    },
    refreshAccessToken: function (callback) {
        var self = this;
        this.requestToken(function (data) {
            console.log("Successfully refreshed access token");
            self.logTime = new Date();
            self.hasAccessToken = true;
            self.accessToken = data["access_token"];
            self.expiresIn = data["expires_in"];
            if (callback) {
                callback();
            }
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
        request.post({
            url: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + this.accessToken,
            form: JSON.stringify(this.menu)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if (data["errcode"] != 0) {
                    console.log("Error when initiating menu: ");
                    console.log("\tError Code: " + data["errcode"]);
                    console.log("\tError Msg: " + data["errmsg"]);
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
    requestToken: function (callback) {
        var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config["wechat_appid"] + "&secret=" + config["wechat_appsecret"];
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            }
            else {
                throw new Error("Error: " + (new Date()).toString() + " - Error when requesting wechat access token.");
                console.log(error);
            }
        });
    },
    initiatePastUsers: function () {
        require("../scripts/user.js");
    },
    generateTemplateUrl: function () {
        return this.templateUrl + this.accessToken;
    },
    sendProgressTemplateMessage: function (openId, nickname, PUID, projectName, status) {
        var data = {
            first: {
                value: "尊敬的" + nickname + "，您的项目状态已更新：",
                color: "#000000"
            },
            keyword1: {
                value: projectName,
                color: "#000000"
            },
            keyword2: {
                value: status,
                color: "#000000"
            },
            remark: {
                value: "请点击此处查看项目状态详情",
                color: "#000000"
            }
        }
        this.sendTemplateMessage(openId, this.applyTemplateId, "http://mp.deep-media.com/progress.html?p=" + PUID, data);
    },
    sendTemplateMessage: function (openId, templateId, url, data) {
        request.post({
            url: this.generateTemplateUrl(),
            form: JSON.stringify({
                touser: openId,
                template_id: templateId,
                url: url,
                topcolor: "#000000",
                data: data
            })
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var ret = JSON.parse(body);
                if (ret["errcode"] && ret["errcode"] != 0) {
                    console.log("Error When sending template " + templateId + " to user " + openId + ": " + JSON.stringify(data));
                    console.log("Error " + ret["errcode"] + ": " + ret["errmsg"]);
                }
            }
            else {
                console.log("Error When sending template " + templateId + " to user " + openId + ": " + JSON.stringify(data));
                console.log(error);
            }
        });
    }
}

module.exports.initiate();
