const moment = require('moment')
const mongoose = require('../mongoose')
const request = require('request');
const config = require('../config')
const User = mongoose.model('User')
const Address = mongoose.model('Address')
const Coupon = mongoose.model('Coupon')
const Cart = mongoose.model('Cart')
/**
 * 微信根据code回去用户openId
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getWxUser = (req, res) => {
    const { code } = req.query
    let urlStr = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.AppID + '&secret=' + config.Secret + '&js_code=' + code + '&grant_type=authorization_code';
    request(urlStr, (error, response, body)=>{
        if (!error && response.statusCode == 200) {
                let data = JSON.parse(body)
                User.findOneAsync({ //查询数据库是否有该用户
                    openid:data.openid,
                })
                .then(result => {
                    if (result) {
                        res.json({
                            code: 200,
                            message: '获取成功',
                            data: {
                                openid:data.openid,
                                session_key:data.session_key,
                                mobile:result.mobile,
                                address:result.address,
                                coupon:result.coupon,
                            }
                        })
                    } else {
                        User.createAsync({
                            openid:data.openid,
                            creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        }).then(result => {
                            Cart.createAsync({ //注册购物车
                                openid:data.openid,
                                goodsList:[]
                            })
                            .then(result=>{
                                res.json({
                                    code: 200,
                                    message: '获取成功',
                                    data: {
                                        openid:data.openid,
                                        session_key:data.session_key
                                    }
                                })
                            })
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        code: -200,
                        message: err.toString(),
                        data
                    })
                })

        }else{
            res.json({
                code: -200,
                data: error
            })
        }
    })
}
/**
 * 绑定手机号
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.bindMobile = (req,res) => {
    const {code,openid,mobile} = req.body
    let data = {
        mobile,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    User.updateAsync({openid}, data, { new: true })
        .then(result => {
            res.json({
                code: 200,
                message: '绑定成功',
                data: result
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })

}

/**
 * 添加地址
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.addCity = (req,res) => {
    
    const {city,name,detailed,mobile,openid } = req.body

    let data = {
        mobile,
        detailed,
        name,
        city,
        openid
    }

    Address.find({openid})
        .then(result => {
            if(result.length < 5){
                Address.createAsync(data)
                .then(result => {
                    res.json({
                        code: 200,
                        message: '添加成功',
                        data: result
                    })
                })
                .catch(err => {
                    res.json({
                        code: -200,
                        message: err.toString()
                    })
                }) 
            }else{
                res.json({
                    code: -200,
                    message: '最多只能添加五个地址',
                })
            }
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
    
}

/**
 * 更新地址
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.editCity = (req,res) => {
    const {city,name,detailed,mobile,openid,id} = req.body
    let data = {
        mobile,
        detailed,
        name,
        city,
        openid
    }
    let _id = id
    Address.updateAsync({_id},data)
        .then(result => {
            res.json({
                code: 200,
                message: '更新成功',
                data: result
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })

}

/**
 * 地址列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.cityList = (req,res) => {
    const {openid} = req.query

    let data = {
        openid
    }

    Address.find(data)
        .then(result => {
            res.json({
                code: 200,
                data: result
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
}

/**
 * 设置默认地址
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.defaultCity = (req,res) => {
    const {id,openid} = req.body
    let _id = id
    Address.find({_id})
        .then(result => {
            if(result){
                let data = {
                    address:{
                        mobile:result[0].mobile,
                        detailed:result[0].detailed,
                        name:result[0].name,
                        city:result[0].city,
                        _id:result[0]._id,
                    },
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }

                let resultData = result
                User.updateAsync({openid}, data, { new: true })
                .then(result => {
                    res.json({
                        code: 200,
                        message: '设置成功',
                        data: resultData[0]
                    })
                })
                .catch(err => {
                    res.json({
                        code: -200,
                        message: err.toString()
                    })
                })
            }else{
                res.json({
                    code: -200,
                    message: '没有该地址'
                })
            }
            

        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })

}

/**
 * 获得优惠券
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getCoupon = (req,res) => {
    const {openid,id} = req.body
    User.find({openid,coupon:{$elemMatch:{id}}})
    .then(result=>{
        console.log(result[0])
        if(result[0]){
            return res.json({
                code: -200,
                message: '你已领取过此优惠券！'
            })
        }else{
            Coupon.find({_id:id}).then(result=>{
                return User.updateAsync({openid},{'$push':{"coupon":{id:result[0].id,state:result[0].state}}})
                .then(result=>{
                    res.json({
                        code: 200,
                        message: '领取成功',
                        data: result
                    })
                })
                .catch(err => {
                    res.json({
                        code: -200,
                        message: err.toString()
                    })
                })
            })
            
        }
    })
    .catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        })
    })

}

/**
 * 获取拥有的优惠券列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.couponList = (req,res) => {
    const {openid} = req.body ;
    console.log(req.body);

    let data = {
        openid
    }
    User.find(data)
        .then(user => {
            let couponId = []
            user[0].coupon.map((v,k)=>{
                couponId.push(v.id)
            })
            Coupon.find({_id:{'$in':couponId},state})
            .then(result => {
                res.json({
                    code: 200,
                    data: result
                })
            })
            .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
}

/**
 * 注册方法
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */

// var UserSchema = new Schema({
//     openid: String,     //唯一标识
//     mobile: Number,     //手机号
//     update_date:String, //更新时间
//     creat_date:String,  //创建时间
//     address:Object,     //地址
//     coupon:Array,        //优惠券
//     pwd:String
// })


// exports.sign=(req,res) => {
//     const {mobile,pwd} = req.body ;
//     console.log(mobile,pwd);
//     // 前段加密
//     if(mobile && pwd){
//         User.createAsync({
//             openid:"",
//             creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
//             update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
//             pwd:pwd,
//             mobile:mobile
//         }
//         ).then(result => {

//             res.json({
//                 code: 200,
//                 message: '添加成功',
//                 data: result
//             })
//         }) .catch(err => {
//             res.json({
//                 code: -200,
//                 message: err.toString()
//             })
//         })
//     }




   //百人圈
//自己的 Appkey
var appkey = '82hegw5u8xulx';
// 替换成您自己的 Secret
var secret = 'KIqodOfQEa';

var RongSDK = require('rongcloud-sdk')({
    appkey: appkey,
    secret: secret
});

// API 文档: http://www.rongcloud.cn/docs/server/sdk/user/user.html#register
var rongUser = RongSDK.User;


exports.sign=(req,res) => {
    const {deviceUUID,name} = req.body ;
    // console.log(mobile,pwd);
    // 
    if(deviceUUID& name){
        User.find({},(err,res)=>{
            console.log("User.find",err,res);
            if(res.length>=100){
                res.json({
                    code: 300,
                    message: '添加失败，人数超过了',
                    
                })
            }
        })
//是否注册过融云
User.find({openid:deviceUUID},(err,res)=>{
    console.log("User.find.openid:deviceUUID",err,res);
    if(res.length>=100){
        res.json({
            code: 200,
            message: '注册过了',
            
        })
    }else{
        var user = {
            id: deviceUUID,
            name: name,
            portrait: 'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982'
        };
        rongUser.register(user).then(result => {
            console.log(result);
            User.createAsync({
                openid:deviceUUID,
                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                name: name
            }
            ).then(result => {
    
                res.json({
                    code: 200,
                    message: '添加成功',
                    data: result
                })
            }) .catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                })
            })


        }, error => {
            console.log(error);
        });
        
    }
})



      


    }



}

