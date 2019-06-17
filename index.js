var path = require('path');
var url = require('url');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var tools = require('./public/src/tools');
// OTPLIB
const otplib = require('otplib');
const qrcode = require('qrcode');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongourl = 'mongodb://localhost:27017';
const dbName = 'atiidb';
// const http = require('http');


app.use(serveStatic(path.join(__dirname, 'public')));

//Tạo port để lắng nghe request từ client gọi lên.
app.listen(3000,function(){
  console.log('Node server running @ http://localhost:3000');
  console.log('__dirname = %s',__dirname);
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
    tools.activateVtn(db, collection, phone, token, res, function(){});
    client.close();
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
});
app.get('/api/reset', function(req,res){
  tools.deactivateVtn(function(result){
    res.sendStatus(result)});
});