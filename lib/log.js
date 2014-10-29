//版权 北京智能社(www.zhinengshe.com)©, 保留所有权利.
//copy right www.zhinengshe.com©, all rights reserved.

module.exports={
	info:	function ()
	{
		console.log.apply(console, [].concat.apply(['[info]'], arguments));
	},
	warn:	function (str)
	{
		console.log.apply(console, [].concat.apply(['[warning]'], arguments));
	},
	error:	function (str)
	{
		console.log.apply(console, [].concat.apply(['[error]'], arguments));
	}
};