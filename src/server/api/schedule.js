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
