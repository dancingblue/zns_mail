//版权 北京智能社(www.zhinengshe.com)©, 保留所有权利.
//copy right www.zhinengshe.com©, all rights reserved.

var mail=require('./../index.js');

/*简易用法，需要从config.js中设置邮箱信息*/
/*samply usage, set up config.js first*/
mail.send(
	{
		to:		'dancingblue@126.com',
		toName:	'blue',
		title:	'just a test',
		msg:	'<body>我就试试啊，<strong style="color:red;">谢谢</strong></body>'
	},
	function (err){
		if(err)
			console.log('error, email send faild');
		else
			console.log('email send successful ended');
	}
);

/*完整用法，在这里写用户名密码*/
/*full usage, write username and password here*/
mail.send(
	{
		host:		'smtp.ym.163.com',
		port:		25,
		user:		'blue@zhinengshe.com',
		password:	'123456'
	},
	{
		from:		'blue@zhinengshe.com',
		fromName:	'blue',
		to:			'dancingblue@126.com',
		toName:		'blue',
		title:		'just a test',
		msg:		'<body>我就试试啊，<strong style="color:red;">谢谢</strong></body>'
	},
	function (err){
		if(err)
				console.log('error, email send faild');
			else
				console.log('email send successful ended');
	}
);









