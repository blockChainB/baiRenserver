var mongoose = require('mongoose')
// mongoose.connect('mongodb://admin:liangliang@127.0.0.1:27017/yogapu', { useUnifiedTopology: true }) //服务器
db = mongoose.connect('mongodb://127.0.0.1:27017/test', { useUnifiedTopology: true }) //服务器
mongoose.Promise = global.Promise
module.exports = mongoose

// MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("test");
//     var whereStr = {"name":'evatsai'};    // 查询条件
//     // var updateStr = {$set: { "url" : "http://geekxia.com" }};
//     dbo.collection("site").deleteOne(whereStr, function(err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });

// db.collection("site").find(res=>{
//     console.log(res);
// })