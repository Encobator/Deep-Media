module.exports = function (req, res, next) {
    
    if (req.method != "POST") {
        next();
    }
    
    var rawbody = "";
    
    req.on("data", function (data) {
        rawbody += data;
    });
    
    req.on("end", function () {
        
        console.log(rawbody);
        
        try {
            req.body = JSON.parse(rawbody);
        }
        catch (ex) {
            req.body = rawbody;
        }
        
        next();
    });
}
