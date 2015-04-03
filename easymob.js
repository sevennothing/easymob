/*
 * Copyright 2014, LongRaise Tech.Co.,Ltd.
 * Filename:easymob.js
 * Author:caijun  Date:2015-04-03
 * Description: 环信 模块
 * TODO: 处理 401 错误：当this.token过期后重新连接，根据 请求返回的错误代码确定连接时机
 *       处理 404 错误
 *       处理 503 错误， 访问限流导致， 重新请求
 * History:
 *         <author>      <time>       <desc>
 *
 */

var config = require('./easymob.json');

var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');

var easymobAction = {
  GetAdminToken: 'GetAdminToken'


};

function Easymob (callback) {
  this.name = 'easymob';
  this.clientId = config.client_id;
  this.client_secret = config.client_secret;
  this.host = config.host;
  this.orgName = config.orgName;
  this.appName = config.appName;
  this.token = "";
  var selfobj = this;
  this.getAdminToken(function(err, res){
    if(err){
      console.log(err.message)
	  callback(err,selfobj)
    }else{
      selfobj.token = res.access_token;
	  callback(null,selfobj)
    }
  });


}

Easymob.prototype.init = function (){
  this.clientId = config.client_id;
  this.client_secret = config.client_secret;
  this.host = config.host;
  this.orgName = config.orgName;
  this.appName = config.appName;
};

/**
 * get administrator Token
 * @param callback
 *    easymob callback
 *    access_token   token value
 *    expires_in     seconds
 *    application    app uuid
 *    error          error code ,if error happend
 *    error_description  error description
 */
Easymob.prototype.getAdminToken = function(callback){
  var path = '/' + this.orgName + "/" + this.appName + "/token";
  var jsonBody = {
    "grant_type":"client_credentials",
    "client_id": this.clientId,
    "client_secret": this.client_secret
  };
  //console.log(path);
  //console.log(jsonBody);

  var options = {
    host: this.host,
    path: path,
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'utf-8',
      'Content-Type':'application/json'
    }
  };

  var req = http.request(options, function (res) {
    var result = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);
      result += chunk;
    });
    res.on('end', function () {
      //console.log(result)
      var resJson = JSON.parse(result);
      if(resJson.error != null){
        var errorMessage = {
          errorCode: resJson.error,
          message: resJson.error_description
        };
        return callback(errorMessage, null);
      }else{
        return callback(null, resJson);
      }

    });

  });
  req.on('error', function (e) {
    console.log(e.message);
    callback(e, null);
  });
  req.write(JSON.stringify(jsonBody));
  req.end();
};

/**
 * 授权模式下注册 IM 用户
 * @param callback
 */
Easymob.prototype.siginIMuser = function(username, password,nickname, callback) {
  var err = {};
  var uname = username || "";
  var pwd = password || "";
  if(uname === "" || pwd === ""){
    err.errorCode = "malformeArgument";
    err.message = "username and password is error";
    return callback(err, {})
  }

  var path = '/' + this.orgName + "/" + this.appName + "/users";
  var jsonBody = {
    "username": uname,
    "password": pwd,
    "nickname": nickname
  };
  //console.log(path);
  //console.log(jsonBody);

  var options = {
    host: this.host,
    path: path,
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'utf-8',
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + this.token
    }
  };

  var req = http.request(options, function (res) {
    var result = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);
      result += chunk;
    });
    res.on('end', function () {
      //console.log(result)
      var resJson = JSON.parse(result);
      if(resJson.error != null){
        var errorMessage = {
          errorCode: resJson.error,
          message: resJson.error_description
        };
        return callback(errorMessage, null);
      }else{
        return callback(null, resJson);
      }

    });

  });
  req.on('error', function (e) {
    console.log(e.message);
    callback(e, null);
  });
  req.write(JSON.stringify(jsonBody));
  req.end();

};

/**
 * 查看用户在线状态
 * @param callback
 */
Easymob.prototype.checkUserOnline = function(username, callback) {
  var err = {};
  var uname = username || "";
  if(uname === ""){
    err.errorCode = "malformeArgument";
    err.message = "username is error";
    return callback(err, {})
  }

  var path = '/' + this.orgName + "/" + this.appName + "/users/" + uname + "/status";
  //console.log(path);

  var options = {
    host: this.host,
    path: path,
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'utf-8',
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + this.token
    }
  };

  var req = http.request(options, function (res) {
    var result = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);
      result += chunk;
    });
    res.on('end', function () {
      //console.log(result)
      var resJson = JSON.parse(result);
      if(resJson.error != null){
        var errorMessage = {
          errorCode: resJson.error,
          message: resJson.error_description
        };
        return callback(errorMessage, null);
      }else{
        return callback(null, resJson);
      }

    });

  });
  req.on('error', function (e) {
    console.log(e.message);
    callback(e, null);
  });
  req.end();

};

/**
 * 发送文本消息
 * @param users
 * @param message_Type
 * @param text
 * @param audioUrl
 * @param imgUrl
 * @param callback
 * @returns {*}
 */
Easymob.prototype.sendMessageToUser = function(users,message_Type,text,audioUrl,imgUrl, callback) {
  var err = {};
  var target = users || [];

  if(target.length === 0){
    err.errorCode = "malformeArgument";
    err.message = "users is error";
    return callback(err, {})
  }

  var path = '/' + this.orgName + "/" + this.appName + "/messages";
  var jsonBody = {
    "target_type": "users",
    "target": users,
    "from": "admin",
    "msg": {
      "type":"txt",
      "msg":message_Type
    },
    "ext": {
      "txt": text,
      "audio":audioUrl,
      "img":imgUrl
    }
  };
  //console.log(path);
  //console.log(jsonBody);

  var options = {
    host: this.host,
    path: path,
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'utf-8',
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + this.token
    }
  };

  var req = http.request(options, function (res) {
    var result = '';
    res.setEncoding('utf8');
	console.log(res.statusCode)
	if(res.statusCode === "503"){
		console.log("====503======");
	
	}
    res.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);
      result += chunk;
    });
    res.on('end', function () {
      console.log(result)
      var resJson = JSON.parse(result);
      if(resJson.error != null){
        var errorMessage = {
          errorCode: resJson.error,
          message: resJson.error_description
        };
        return callback(errorMessage, null);
      }else{
        return callback(null, resJson);
      }

    });

  });
  req.on('error', function (e) {
    console.log(e.message);
    callback(e, null);
  });
  req.write(JSON.stringify(jsonBody));
  req.end();
};

module.exports = exports = Easymob;
