//版权 北京智能社(www.zhinengshe.com)©, 保留所有权利.
//copy right www.zhinengshe.com©, all rights reserved.

var log=require('./log');
var config=require('./../config.js');
var net=require('net');
var EventEmitter=require('events').EventEmitter;

var debug=config.debug;

function wring(obj1, obj2)
{
	obj1=obj1||{};
	obj2=obj2||{};
	
	for(var i in obj2)
		if(!obj1[i])
			obj1[i]=obj2[i];
	
	return obj1;
}

/*
sndOpt=>{host, port, user, password}
msgOpt=>{from, fromName, to, toName, title, msg}
*/
function sendMail(sndOpt, msgOpt, fnEnd)
{
	msgOpt.fromName=msgOpt.fromName||msgOpt.from;
	msgOpt.toName=msgOpt.toName||msgOpt.to;
	
	var ev=new EventEmitter();
	var ok=false;
	
	var client=net.createConnection({
		host: 'smtp.ym.163.com',
		port: 25
	});
	
	/*
	步骤
1.	S:220 XXX
	C:HELO xxx
2.	S:250 OK
	C:AUTH LOGIN
3.	S:334 dxNlcm5hbWU6
	C:BASE64编码的用户名
4.	S:334 UGFzc3dvcmQ6
	C:BASE64编码的密码
5.	S:235 auth successfully
	C:MAIL FROM:xxx
6.	S:250 OK
	C:RCPT TO:xxx
7.	S:250 OK
	C:DATA
8.	S:354 Enter mail, end with "." on a line by itself
	C:From:名字<xx@xx.com>
	C:Subject:xxxx
	C:To:xxx
	C:内容
	C:.
9.	S:250 Message sent
	C:QUIT
10.	S:221 Bye
	*/
	
	ev.once('data', step_helo);
	//1.
	function step_helo(num, data)
	{
		if(num!=220)
			error(num, data);
		else
		{
			send('HELO zhicode mail sender');
			
			ev.once('data', step_login);
		}
	}
	
	//2.
	function step_login(num, data)
	{
		if(num!=250)
			error(num, data);
		else
		{
			send('AUTH LOGIN');
			
			ev.once('data', step_user);
		}
	}
	
	//3.
	function step_user(num, data)
	{
		if(num!=334)
			error(num, data);
		else
		{
			send(new Buffer(sndOpt.user).toString('base64'));
			
			ev.once('data', step_password);
		}
	}
	
	//4.
	function step_password(num, data)
	{
		if(num!=334)
			error(num, data);
		else
		{
			send(new Buffer(sndOpt.password).toString('base64'));
			
			ev.once('data', step_from);
		}
	}
	
	//5.
	function step_from(num, data)
	{
		if(num!=235)
			error(num, data);
		else
		{
			send('MAIL FROM:'+msgOpt.from);
			
			ev.once('data', step_to);
		}
	}
	
	//6.
	function step_to(num, data)
	{
		if(num!=250)
			error(num, data);
		else
		{
			send('RCPT TO:'+msgOpt.to);
			
			ev.once('data', step_data);
		}
	}
	
	//7.
	function step_data(num, data)
	{
		if(num!=250)
			error(num, data);
		else
		{
			send('DATA');
			
			ev.once('data', step_content);
		}
	}
	
	//8.
	function step_content(num, data)
	{
		if(num!=354)
			error(num, data);
		else
		{
			send('From:'+msgOpt.fromName+'<'+msgOpt.from+'>');
			send('To:{'+msgOpt.toName+'}<'+msgOpt.to+'>');
			send('Subject:'+msgOpt.title);
			send('Content-type:text/html');
			send('');
			send(msgOpt.msg);
			send('.');
			
			ev.once('data', step_quit);
		}
	}
	
	//9.
	function step_quit(num, data)
	{
		if(num!=250)
			error(num, data);
		else
		{
			send('QUIT');
			
			ev.once('data', step_bye);
		}
	}
	
	//10.
	function step_bye(num, data)
	{
		if(num!=221)
			error(num, data);
	}
	
	function error(num, data)
	{
		debug && log.error('===ERROR===', num, data);
		
		fnEnd && fnEnd(true);
		fnEnd=null;
		
		client.end();
	}
	
	function send(data)
	{
		client.write(data+'\r\n');
		debug && log.info('C:', data);
	}
	
	client.on('data', function (data){
		var str=data.toString();
		var arr=str.split(/\s/, 1);
		
		debug && log.info('S:', data+'');
		ev.emit('data', parseInt(arr[0]), arr[1]);
	});
	client.on('error', function (err){
		debug && log.error(err);
		fnEnd && fnEnd(err);
	});
	client.on('end', function (){
		debug && log.info('end');
		fnEnd && fnEnd(ok);
	});
	
	//client.write('aaa');
}

module.exports={
	send:	function (arg, fn){
		var varg=arguments;
		
		if(varg.length==2 && (typeof varg[0]=='object') && (typeof varg[1]=='function'))
			sendMail(config.mail_config_user, wring(arg, config.mail_config_sender), fn);
		else if(varg.length==3 && (typeof varg[0]=='object') && (typeof varg[1]=='object') && (typeof varg[2]=='function'))
			sendMail(varg[0], varg[1], varg[2]);
		else
			throw new Error('argument error');
	}
};





