module.exports = function (req, res, next) {
    
    if (req.method != "POST") {
        next();
    }
    
    var rawbody = "";
    
    req.on("data", function (data) {
        rawbody += data;
    });
    
    req.on("end", function () {
        
        req.body = JSON.parse(rawbody);
        req.rawbody = rawbody;
        
        next();
    });
}
