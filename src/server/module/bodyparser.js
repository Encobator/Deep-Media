module.exports = function (req, res, next) {
    
    var rawbody = "";
    
    req.on("data", function (data) {
        rawbody += data;
    });
    
    req.on("end", function () {
        try {
            req.body = JSON.parse(rawbody);
        }
        catch (ex) {
            req.body = rawbody;
        }
        
        next();
    });
}
