module.exports = {
    ARTICLE_AMOUNT: 10,
    getArticles: function (amount, callback) {
        
    },
    getTopArticles: function (callback) {
        this.getArticles(this.ARTICLE_AMOUNT, function (result) {
            
        });
    }
}
