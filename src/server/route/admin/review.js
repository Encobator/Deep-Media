var mysql = require("../../module/mysql.js");
var User = require("../../api/user.js");

module.exports = function (req, res, callback) {
  User.verify(req, res, function(){
      mysql.query("SELECT * FROM comment", function(err, result){
          if (err){
              console.log("Error selecting: " + err);
          } else {
            if (result.length <= 0){
              callback(null);
            }
            else {
              callback({"reviews": result});
            }
            //res.render('home', {page_title:'Barry\'s personal anydo', data: rows});
          }
      });
  });
}
