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
};
