/*
 * Copyright 2014, LongRaise Tech.Co.,Ltd.
 * Filename:easymob_test.js
 * Author:caijun  Date:2015-04-03
 * Description: 环信 模块 测试
 * History:
 *         <author>      <time>       <desc>
 *
 */

var Easymob = require('./easymob');

var easymob = new Easymob(function(err,em){
	if(err){
		console.log(err.message);
		exit(0);
	}
	console.log(em);
/*
	easymob.siginIMuser("jun","123","junnick",function(err, res){
		if(err){
		console.log(err.message)
		}else{
		console.log(res);
		}
		});
*/
	var i = 0;
	var j = 0;
	/*
	for(i=0; i<400; i++){
		easymob.checkUserOnline("jun",function(err,res){
			j++;
			if(err){
				console.log(err.message)
			}else{
				console.log("checkOnline:" + j + " : " + res.data.jun);
			}

			});
	}
	*/
	for(i=0; i<40; i++){
	easymob.sendMessageToUser(["jun2"],"consumer Needs","一包盐巴","","",function(err,res){
			j++;
			if(err){
			console.log(err.message)
			}else{
			console.log("send message : " + j + " : " + res.data.jun);
			}

			});
	}


});


/*
easymob.getAdminToken(function(err,res){
  if(err){
    console.log(err.message)
  }else{
    console.log(res);
	easymob.token = res.access_token;
  }
		
});

setTimeout(function(){
	console.log(easymob)	
},2000)
*/


