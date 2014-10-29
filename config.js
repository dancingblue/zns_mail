//版权 北京智能社(www.zhinengshe.com)©, 保留所有权利.
//copy right www.zhinengshe.com©, all rights reserved.

/*这里是一些配置信息，可以不写*/
/*some configuration*/
module.exports={
	/*调试开关*/
	/*debug flag*/
	debug:	false,
	/*邮箱登陆信息，最好从邮箱网站确认一下再写*/
	/*email login info, obtain from your email provider*/
	mail_config_user:{
		host:		'smtp.ym.163.com',
		port:		25,
		user:		'blue@zhinengshe.com',
		password:	'123456abc'
	},
	/*发件人信息-仅用于显示*/
	/*sender info-display only*/
	mail_config_sender:{
		from:		'blue@zhinengshe.com',
		fromName:	'智能社Blue'
	}
};