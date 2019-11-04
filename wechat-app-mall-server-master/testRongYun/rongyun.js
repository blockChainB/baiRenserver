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
var User = RongSDK.User;
var user = {
	id: 'ujadk90ha',
	name: 'Maritn',
	portrait: 'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982'
};
User.register(user).then(result => {
	console.log(result);
}, error => {
	console.log(error);
});