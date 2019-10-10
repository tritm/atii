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
