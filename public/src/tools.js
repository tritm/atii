const otplib = require('otplib');
var http = require('http');
module.exports = {
  activateVtn: function (db, collection, phone, token, res, callback) {
    collection.find({phone:phone}).toArray(function(err, result) {
      const isValid = otplib.authenticator.check(token, result["0"].secret);
      res.send(isValid);
      if (isValid) {
        var options = {
          'hostname': 'rd5',
          'port':     '8080',
          'path':     '/vtn/onos/v1/applications/org.opencord.vtn/active',
          'auth':     'onos:rocks',
          'method':   'POST'
        }
        var request = http.request(options, function (response) {
          console.log('STATUS: ' + response.statusCode);
          console.log('HEADERS: ' + JSON.stringify(response.headers));
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          });
        });
        request.end();
      };
    });
    callback();
  },
  deactivateVtn: function (callback) {
    var options = {
      'hostname': 'rd5',
      'port':     '8080',
      'path':     '/vtn/onos/v1/applications/org.opencord.vtn/active',
      'auth':     'onos:rocks',
      'method':   'DELETE'
    }
    var request = http.request(options, function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
      callback(response.statusCode);
    });
    request.end();
  },
  listFlows: function (callback) {
    var options = {
      "method": "GET",
      "hostname": "rd5",
      "port": "8080",
      "path": "/vtn/onos/v1/flows/",
      "headers": {
        "authorization": "Basic b25vczpyb2Nrcw==",
        "cache-control": "no-cache",
        "postman-token": "8e873279-11d0-8268-4208-510d5d213d37"
      }
    };
    var lstFlows;
    var req = http.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        var strFlows = body.toString();
        var objFlows = JSON.parse(strFlows);
        lstFlows = objFlows.flows;
        callback(lstFlows);
        // console.log(lstFlows.length);
        console.log(lstFlows[0]);


        // console.log(strFlows.split(":"))
      });
    });
    req.end()
  },
  startOnu: function (callback) {
    var options = {
      "method": "GET",
      "hostname": "192.168.100.43",
      "port": null,
      "path": "/cgi-bin/hoge3.cgi?onu=X12345678X&method=ON",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "d6270930-8e46-3043-8381-be221a8d9b01"
      }
    };
    var req = http.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });
    req.end();
  },
  stopUnu: function(callback) {
    var options = {
      "method": "GET",
      "hostname": "192.168.100.43",
      "port": null,
      "path": "/cgi-bin/hoge3.cgi?onu=X12345678X&method=OFF",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "0a9a0b15-9c7c-cfc8-ab3f-0ce436bed130"
      }
    };
    var req = http.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });
    req.end();
  }
};
