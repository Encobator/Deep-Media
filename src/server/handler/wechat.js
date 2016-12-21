var ejs = require("ejs");
var xml2js = require("xml2js");
var Wechat = require("../api/wechat.js");
var User = require("../api/user.js");
var config = require("../data/config.json");
var parseXml = xml2js.parseString;
var toXml = new xml2js.Builder().buildObject;

var xmlTemplate = ['<xml>',
    '<ToUserName><![CDATA[<%-ToUserName%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-FromUserName%>]]></FromUserName>',
    '<CreateTime><%=CreateTime%></CreateTime>',
    '<% if (MsgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=MsgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=MsgType%>]]></MsgType>',
    '<% } %>',
  '<% if (MsgType === "news") { %>',
    '<ArticleCount><%=Content.length%></ArticleCount>',
    '<Articles>',
    '<% Content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (MsgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-Content.title%>]]></Title>',
      '<Description><![CDATA[<%-Content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-Content.musicUrl || Content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-Content.hqMusicUrl || Content.hqUrl %>]]></HQMusicUrl>',
      '<% if (Content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-Content.thumbMediaId || Content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (MsgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-Content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (MsgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-Content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (MsgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-Content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-Content.title%>]]></Title>',
      '<Description><![CDATA[<%-Content.description%>]]></Description>',
    '</Video>',
  '<% } else if (MsgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (MsgType === "device_text" || MsgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (MsgType === "device_text") { %>',
      '<Content><![CDATA[<%-Content%>]]></Content>',
    '<% } else if ((MsgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-Content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (MsgType === "transfer_customer_service") { %>',
    '<% if (Content && Content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-Content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-Content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');
var compileXml = ejs.compile(xmlTemplate);

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

function onText(req, res) {
    res.replyText("谢谢您的反馈");
}

function onSubscribe(req, res) {
    User.newUser(req.body.FromUserName, function (info) {
        if (info) {
            res.replyText(info["nickname"] + "，感谢您的关注～您可以点击下方的菜单查看我们的原创作品");
        }
        res.end();
    });
}

function onUnsubscribe(req, res) {
    
}

function onClick(req, res) {
    
}

module.exports = {
    get: function (req, res) {
        if (Wechat.verify(req.query["signature"], req.query["timestamp"], req.query["nonce"])) {
            res.write(req.query["echostr"]);
        }
        res.end();
    },
    post: function (req, res) {
        switch (req.body.MsgType) {
            case "text": onText(req, res); break;
            case "event":
                switch (req.body.Event) {
                    case "subscribe": onSubscribe(req, res); break;
                    case "unsubscribe": onUnsubscribe(req, res); break;
                    case "CLICK": onClick(req, res); break;
                    default: res.end(); break;
                }
                break;
            default: res.end(); break;
        }
    },
    process: function (req, res, next) {
        
        //Check method
        if (req.method != "POST") {
            next();
        }
        
        //Add api for reply text
        res.replyText = function (text) {
            var openId = req.body.FromUserName;
            var json = {
                "ToUserName": openId,
                "FromUserName": config["wechat_id"],
                "CreateTime": (new Date()).getTime(),
                "MsgType": "text",
                "Content": text
            }
            var xml = compileXml(json);
            res.write(xml);
            res.end();
        }
        
        //Generate request rawbody and body
        req.rawbody = "";
        req.on("data", function (data) {
            req.rawbody += data;
        }).on("end", function () {
            parseXml(req.rawbody, {trim: true}, function (err, result) {
                if (!err) {
                    req.body = formatMessage(result);
                }
                next();
            });
        });
    }
}
