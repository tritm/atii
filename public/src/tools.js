const otplib = require('otplib');
var http = require('http');
const swid = 'of:0000525400925100';
module.exports = {
  activateVtn: function (db, collection, phone, token, res, callback) {
    collection.find({phone: phone}).toArray(function (err, result) {
      const isValid = otplib.authenticator.check(token, result["0"].secret);
      res.send(isValid);
      if (isValid) {
        var options = {
          'hostname': 'rd5',
          'port': '8080',
          'path': '/vtn/onos/v1/applications/org.opencord.vtn/active',
          'auth': 'onos:rocks',
          'method': 'POST'
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
      }
      ;
    });
    callback();
  },
  checkToken: function (db, collection, phone, token, res, callback) {
    var hrstart = process.hrtime();
    collection.find({phone: phone}).toArray(function (err, result) {
      const isValid = otplib.authenticator.check(token, result["0"].secret);
      callback(isValid);
    });
    var hrend = process.hrtime(hrstart);
    console.info('checkToken: Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  },
  deactivateVtn: function (callback) {
    var options = {
      'hostname': 'rd5',
      'port': '8080',
      'path': '/vtn/onos/v1/applications/org.opencord.vtn/active',
      'auth': 'onos:rocks',
      'method': 'DELETE'
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
        // console.log(lstFlows[0]);
        // console.log(strFlows.split(":"))
      });
    });
    req.end()
  },
  startOnu: function (callback) {
    var options = {
      "method": "GET",
      // "hostname": "192.168.100.43",
      "hostname": "localhost",
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
  stopOnu: function (callback) {
    var options = {
      "method": "GET",
      // "hostname": "192.168.100.43",
      "hostname": "localhost",
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
  },
  deleteFlow: function (flowid2delete, callback) {
    var options = {
      "method": "DELETE",
      "hostname": "rd5",
      "port": "8080",
      "path": "/vtn/onos/v1/flows/of:000052540080a532/" + flowid2delete,
      "headers": {
        "authorization": "Basic b25vczpyb2Nrcw==",
        "cache-control": "no-cache",
        "postman-token": "cf8f80a2-cc93-a305-9d66-84e6a01f0596"
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
  addFlow: function (callback) {
    var options = {
      "method": "POST",
      "hostname": "rd5",
      "port": "8080",
      "path": "/vtn/onos/v1/flows/of:000052540080a532",
      "headers": {
        "authorization": "Basic b25vczpyb2Nrcw==",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "postman-token": "197c7584-1c52-d4fd-9f78-7cb2c38bb6d4"
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

    req.write("{\"priority\": 56000, \"tableId\": 0, \"timeout\": 0, \"isPermanent\": true, \"deviceId\": \"of:000052540080a532\", \"treatment\": { \"instructions\": [{\"type\": \"L2MODIFICATION\",\"subtype\": \"VLAN_PUSH\",\"ethernetType\": \"0x8100\"},{\"type\": \"L2MODIFICATION\",\"subtype\": \"VLAN_ID\",\"vlanId\":222},{\"type\": \"OUTPUT\", \"port\": \"11\"}]},\"selector\": {\"criteria\":[{\"type\": \"IN_PORT\", \"port\": \"8\"}]}}");
    req.end();
  },
  addFlow1: function (callback) {
    var options = {
      "method": "POST",
      "hostname": "rd5",
      "port": "8080",
      "path": "/vtn/onos/v1/flows/of:000052540080a532",
      "headers": {
        "authorization": "Basic b25vczpyb2Nrcw==",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "postman-token": "2f08a392-4391-6441-06a7-e6affd00e4ce"
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

    req.write("{\"priority\": 56000, \"tableId\": 0, \"timeout\": 0, \"isPermanent\": true, \"deviceId\": \"of:000052540080a532\", \"treatment\": { \"instructions\": [{\"type\": \"L2MODIFICATION\",\"subtype\": \"VLAN_POP\"}, {\"type\": \"OUTPUT\", \"port\": \"8\"}]},\"selector\": {\"criteria\":[{\"type\": \"IN_PORT\", \"port\": \"11\"}, {\"type\": \"VLAN_VID\",\"vlanId\": \"222\"}]}}");
    req.end();
  }
}

