module.exports = {
    ARTICLE_AMOUNT: 10,
    getArticles: function (callback) {
        mysql.query("SELECT * FROM `v9_news` LIMIT 30", {}, function (err, result) {
            if (err) {
                callback(null);
            }
            else {
                callback(result);
            }
        })
    },
}
