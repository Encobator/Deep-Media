module.exports = function (req, res, next) {
    
    if (req.method != "POST") {
        next();
    }
    
    var rawbody = "";
    
    req.on("data", function (data) {
        rawbody += data;
    });
    
    req.on("end", function () {
        
        try {
            req.body = JSON.parse(rawbody);
        }
        catch (ex) {
            
            console.log("CANNOT SOLVE JSON");
            req.rawbody = rawbody;
        }
        
        next();
    });
}
