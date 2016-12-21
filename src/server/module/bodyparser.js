module.exports = function (req, res, next) {
    
    if (req.method != "POST") {
        next();
    }
    
    req.rawbody = "";
    
    req.on("data", function (data) {
        req.rawbody += data;
    });
    
    req.on("end", function () {
        
        try {
            req.body = JSON.parse(req.rawbody);
        }
        catch (err) {
            //Do Nothing
        }
        
        next();
    });
}
