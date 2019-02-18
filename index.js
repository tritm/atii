var path = require('path');
var url = require('url');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
// OTPLIB
const otplib = require('otplib');
const qrcode = require('qrcode');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongourl = 'mongodb://localhost:27017';
const dbName = 'atiidb';
const http = require('http');
const mongoose = require("mongoose");

mongoose.connect(mongourl, function (err, client) {
  const db = client.db(dbName);
  global.collections = {
    user     : db.collection(''),
    document : db.collection('documents')
  }
});

collections.find({}).toArray(function (err, docs) {
  if (err) console.log(err);
  console.log(docs)
});

app.use(serveStatic(path.join(__dirname, 'public')));

//Tạo port để lắng nghe request từ client gọi lên.
app.listen(3000,function(){
  console.log('Node server running @ http://localhost:3000');
});

// var listUsers = [{id: 1, name: 'Nguyễn Văn A'}, {id: 2, name: 'Hoàng Thị B'}, {id: 3, name: 'Phan Huy C'}];
var listUsers;
app.get('/', function(req, res){
  res.redirect('/src/client.html');
});
app.get('/client', function(req, res){
  res.redirect('/src/client.html');
});
app.get('/admin', function(req, res){
  res.redirect('/src/admin.html');
});
app.get('/api/getName/:userId', function(req, res){
  var userId = req.params.userId;
  var user = listUsers.find(u => u.id == userId);
  if(user)
    res.send(user.name);
  else
    res.send('User not found!!!')
});
app.get('/api/listUsers', function(req, res){
  MongoClient.connect(mongourl, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents')
    collection.find({}).toArray(function (err, docs) {
      if (err) console.log(err);
      res.send(docs);
      client.close();
    });
  });
});
app.delete('/api/deleteHost/:mac2delete', function(req, res) {
  const mac2delete = req.params.mac2delete;
  var http = require("http");

  var options = {
    "method": "DELETE",
    "hostname": "rd5",
    "port": "8080",
    "path": "/vtn/onos/v1/hosts/" + mac2delete + "/None",
    "headers": {
      "authorization": "Basic b25vczpyb2Nrcw==",
      "cache-control": "no-cache",
      "postman-token": "57898659-80f3-f5a0-2ae3-3d529dae25df"
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
})
app.delete('/api/deleteUser/:phone2delete', function(req, res) {
  const phone2delete = req.params.phone2delete;
  MongoClient.connect(mongourl, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents')
    collection.deleteMany({phone:phone2delete}, function(err, result) {
      if (err) console.log("[TRITM] error = "+err);
      collection.find({}).toArray(function (err, docs) {
        if (err) console.log(err);
        res.send(docs);
      });
      client.close();
    });
  });
})
app.post('/api/insertUser', function(req,res){
  const name = req.query.name;
  const phone = req.query.phone;
  const secret = otplib.authenticator.generateSecret();
  console.log('[TRITM] query: name=%s phone=%s secret=%s',name,phone,secret);
  console.log('[TRITM] query = '+JSON.stringify(req.query));
  MongoClient.connect(mongourl, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('documents')
    collection.insertOne({name:name,phone:phone,secret:secret}, function(err, result) {
      if (err) console.log("[TRITM] error = "+err);
      collection.find({}).toArray(function (err, docs) {
        if (err) console.log(err);
        res.send(docs);
      });
      client.close();
    });
  });
});
/*TODO: Inclue this clean function to Delete
if var of delete = null, clean*/
app.delete('/api/clean/', function(req,res){
  MongoClient.connect(mongourl, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents');
    collection.deleteMany({phone:""}, function(err, result) {
      collection.find({}).toArray(function (err, docs) {console.log(JSON.stringify(docs))});
      if (err) console.log("[TRITM] error = "+err);
      console.log("[TRITM] result = "+result);
      client.close();
    });
  });
});
app.get('/api/checktoken', function(req,res){
  const phone = req.query.phone;
  const token = req.query.token;
  MongoClient.connect(mongourl, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents');
    collection.find({phone:phone}).toArray(function(err, result) {
      const isValid = otplib.authenticator.check(token, result["0"].secret);
      res.send(isValid);
      if (isValid) {
        var http = require("http");

        var options = {
          "method": "POST",
          "hostname": "rd5",
          "port": "8080",
          "path": "/vtn/onos/v1/hosts",
          "headers": {
            "authorization": "Basic b25vczpyb2Nrcw==",
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "65c70ef8-4c55-85b7-4473-b3fd98af9183"
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
        req.write(JSON.stringify({ id: '02:42:0A:07:01:03/None',
          mac: '02:42:0A:07:01:03',
          vlan: 'None',
          configured: false,
          ipAddresses: [ '10.7.1.3' ],
          location: { elementId: 'of:0000525400e35d7e', port: '3' },
          annotations:
            { originalHostId: 'FA:16:3E:0E:69:44/None',
              networkId: 'b0a95514-0aed-4360-8940-da9729ec2f33',
              networkType: 'VSG',
              portId: 'ebeffe7e-c5a4-42fc-8193-7a63a84a962a',
              createTime: '1540864611904' } }));
        req.end();
      };
      client.close();
    });
  });
});
app.get('/api/showQR/:phone2show', function(req, res) {
  const phone = req.params.phone2show;
  MongoClient.connect(mongourl, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents')
    collection.find({phone:phone}).toArray(function(err, result) {
      const secret = result["0"].secret;
      const otpauth = otplib.authenticator.keyuri('user', 'service', secret);
      qrcode.toDataURL(otpauth, (err, imageUrl) => {
        res.send(imageUrl);
        client.close();
      });
    });
  });
})