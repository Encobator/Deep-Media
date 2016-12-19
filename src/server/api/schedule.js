var xml2js = require("xml2js");
var XML = parse();
XML.parse = new xml2js.Parser().parseString();
XML.build = new xml2js.Builder().buildObject();
var request = require("request");

module.exports = [
    {
        name: "Update Access Key",
        rule: "*/30 * * * *",
        action: function () {
            var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    
                }
                else {
                    throw new Error("Error: " + (new Date()).toString() + " - Error when requesting wechat access key.");
                }
            })
        }
    }
];
