module.exports = {
    process: function (req, res) {
        res.write(req.query["echostr"]);
    }
}
