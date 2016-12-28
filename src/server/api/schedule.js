var Wechat = require("./wechat.js");

module.exports = [
    {
        name: "Refresh Access Token",
        rule: "*/60 * * * *",
        action: function () {
            Wechat.refreshAccessToken();
        }
    }
];
