// let mongoose = require('mongoose')

// db=mongoose.connect('mongodb://localhost:27017/person2')  // 数据库的端口号根据需求进行调整，一般直接安装mongodb并启动后，端口号默认是27017，如果通过docker安装，端口号会是其他的。blog是我们博客的数据库的名字，如果没有名字为blog的数据库，会自动添加。

// ///打印连接状态的日志，可自行选择写与不写
// mongoose.connection.on('connected', (req, res) => {
//   console.log('MongoDB connected success',req,res);
// })
// mongoose.connection.on('err', (req, res) => {
//   console.log('MongoDB connected fail')
// })
// mongoose.connection.on('disconnected', (req, res) => {
//   console.log('MongoDB connected disconnected')
// })
// // var TestSchema = new Schema({ num: Number });
// // var TestModel = db.model('Test', TestSchema);
// // TestModel.find({ num: 'not a number' }).error(new Error('woops')).exec(function(error) {
// //   // `error` will be a cast error because `num` failed to cast
// // });
// var Schema = mongoose.Schema;
// console.log(db);

// var personSechma = new Schema({
//     name:String,
//     age:String,
//     status:String
// },{collation:"ppp"});

// var p = mongoose.model("ppp",personSechma );

// // 增加

// var person1 = new p({
//     name:"xiaowang1",
//     age:"88",
//     status:"D"
// });

// // person1.save(function (err,res){
// //     if(err){
// //         console.log(err);
// //     }else{
// //         console.log("success");
// //     }
// // })

// //查询
// // [
// //     {
// //       _id: 5db9578b41336f6a4db83cbe,
// //       name: 'xiaowang',
// //       age: '202',
// //       status: 'C',
// //       __v: 0
// //     }
// //   ]

// // p.find({_id:{$eq:"5db9578b41336f6a4db83cbe"}},  (err,res)=>{
// //     console.log(res[0]);
// // }
// // )

// //连表查询   

// // 只要people的name和ppps表下面的name只要相等的话，就把查到的的数据放到到namename下面来
// // db.ppps.aggregate([
// //     ... {
// //     ...  $lookup:{
// //     ...         from:"people",
// //     ...         localField:"name",
// //     ...         foreignField:'name',
// //     ...          as:"namename"
// //     ...        }
// //     ...  }
// //     ... ]);
// //     { "_id" : ObjectId("5db95cc67efefe6a841c33b6"), "name" : "xiaowang", "age" : "202", "status" : "C", "__v" : 0, "namename" : [ { "_id" : ObjectId("5db95681c973da6a3be4bfb5"), "name" : "xiaowang", "age" : "19", "status" : "C", "__v" : 0 }, { "_id" : ObjectId("5db956b12ac0fa6a41794635"), "name" : "xiaowang", "age" : "19", "status" : "C", "__v" : 0 }, { "_id" : ObjectId("5db95737d245f46a46d95653"), "name" : "xiaowang", "age" : "222", "status" : "C", "__v" : 0 }, { "_id" : ObjectId("5db9578b41336f6a4db83cbe"), "name" : "xiaowang", "age" : "202", "status" : "C", "__v" : 0 } ] }

// //  联合查询

// // p.aggregate([{
// //     $lookup:{
// //         from:"people",
// //         localField:"name",
// //         foreignField:"name",
// //         as:"testName"
// //     },
   
// // },
// // { $unwind: "$testName"

// // },


// // ]).then(value=>{
// //       var array = [];
// //         value.forEach(element => {
// //             var dic = element["testName"];
// //             array.push(dic);
            
// //       })
// //       console.log("...",JSON.stringify(array));
        
// //     })

// //改
// // p.updateMany({name:"xiaowang1"},{
// //     status:"E"
// // }).then(res=>{
// //     console.log(res,"...");
// // })

// // p.updateMany({name: 'xiaowang1'}, {age: 80}).then(result => {
// //     console.log(result)
// // })

// // p.deleteOne({"name": 'xiaowang'},res=> {
 
// //   console.log("文档删除成功");

// // })


    
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
 
// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("");
//     var whereStr = {"name":'evatsai'};    // 查询条件
//     dbo.collection("site").deleteOne(whereStr, function(err, obj) {
//         if (err) throw err;
//         console.log("文档删除成功");
//         db.close();
//     });
// });


// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
 
// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("runoob");
//     var whereStr = {"name":'evatsai'};    // 查询条件
//     var updateStr = {$set: { "url" : "http://geekxia.cn" }};
//     dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var whereStr = {"name":'evatsai'};    // 查询条件
    // var updateStr = {$set: { "url" : "http://geekxia.com" }};
    dbo.collection("site").deleteOne(whereStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        db.close();
    });
});