module.exports = function (req, res, next) {
    
    if (req.method != "POST") {
        next();
    }
    
    req.rawbody = "";
    
    req.on("data", function (data) {
        req.rawbody += data;
    });
    
    req.on("end", function () {
        
        next();
    });
}
