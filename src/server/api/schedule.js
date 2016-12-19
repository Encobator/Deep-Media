var xml2js = require("xml2js");
var XML = parse();
XML.parse = new xml2js.Parser().parseString();
XML.build = new xml2js.Builder().buildObject();
var request = require("request");
var Wechat = require("./Wechat.js");

module.exports = [
    {
        name: "Refresh Access Token",
        rule: "*/30 * * * *",
        action: function () {
            Wechat.refreshAccessToken();
        }
    }
];
