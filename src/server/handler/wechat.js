var ejs = require("ejs");
var xml2js = require("xml2js");
var Wechat = require("../api/wechat.js");
var User = require("../api/user.js");
var config = require("../data/config.json");
var parseXml = xml2js.parseString;
var toXml = new xml2js.Builder().buildObject;

var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '<% if (content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

function formatMessage(result) {
    result = result.xml;
    var message = {};
    if (typeof result === 'object') {
        for (var key in result) {
            if (!(result[key] instanceof Array) || result[key].length === 0) {
                continue;
            }
            if (result[key].length === 1) {
                var val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                }
                else {
                    message[key] = (val || '').trim();
                }
            }
            else {
                message[key] = [];
                result[key].forEach(function (item) {
                    message[key].push(formatMessage(item));
                });
            }
        }
        return message;
    }
    else {
        return result;
    }
}

module.exports = {
    process: function (req, res) {
        
        if (req.method == "GET") {
            
            console.log("Verifying");
            
            if (Wechat.verify(req.query["signature"], req.query["timestamp"], req.query["nonce"])) {
                res.write(req.query["echostr"]);
            }
            res.end();
        }
        else if (req.method == "POST") {
            
            console.log("RECEIVED MESSAGE!!!");
            console.log(req.rawbody);
            
            parseXml(req.rawbody, {trim: true}, function (err, result) {
                if (err) {
                    
                    console.log(err);
                    
                    res.end();
                }
                else {
                    
                    console.log(result);
                    
                    result = formatMessage(result);
                    
                    console.log(result);
                    
                    switch (result.MsgType) {
                    case "text":
                        var content = result.Content;
                        var openId = result.FromUserName;
                        var reply = {
                            "toUserName": openId,
                            "fromUserName": config["wechat_id"],
                            "createTime": (new Date()).getTime(),
                            "msgType": "text",
                            "content": "你个傻逼"
                        }
                        var xml = compiled(reply);
                        
                        console.log("reply: " + xml);
                        
                        res.write(xml);
                        res.end();
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
                    default:
                        res.end();
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
