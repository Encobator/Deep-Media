var request = require("request");
var Wechat = require("../api/wechat.js");
var User = require("../api/user.js");

function addAllUsers(ids) {
    
    /**
     * [addUser description]
     * @param {[type]} i
     */
    function addUser(i) {
        
        //Base case
        if (i >= ids.length) {
            return;
        }
        
        //Check user exists
        User.existOpenId(ids[i], function (exists) {
            if (exists) {
                console.log("Skipping user " + ids[i]);
                addUser(i + 1);
            }
            else {
                User.newUser(ids[i], function (success) {
                    if (success) {
                        console.log("Successfully added already subscribed user " + ids[i]);
                    }
                    addUser(i + 1);
                });
            }
        })
    }
    
    addUser(0);
}

function getPartialUser(nextId, amount) {
    var url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + Wechat.accessToken;
    if (nextId) {
        url += "&next_openid=" + nextId;
    }
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            if (data["errcode"] && data["errcode"] != 0) {
                console.log("Error " + data["errcode"] + ": " + data["errmsg"]);
            }
            else {
                if (!nextId) {
                    console.log(data["total"] + " users in total.");
                }
                addAllUsers(data["data"]["openid"]);
                amount += data["count"];
                if (data["total"] > amount) {
                    getPartialUser(data["next_openid"], amount);
                }
            }
        }
        else {
            throw new Error("Error: " + (new Date()).toString() + " - Error when getting all users");
            console.log(error);
        }
    })
}

function getAllUser() {
    if (Wechat.hasAccessToken) {
        getPartialUser(undefined, 0);
    }
}

getAllUser();
