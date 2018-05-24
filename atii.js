// OTPLIB
const otplib = require('otplib');
const qrcode = require('qrcode');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'atiidb';

// // THIẾT LẬP BẢNG IDOCS CHỨA CÁC THÔNG TIN VỀ KHÁCH HÀNG: NAME, PHONE, SECRET VÀ LƯU VÀO MONGODB
// var secrets = [];
// var idocs = [];
// var names = ["Tri Trinh", "Hoang Tran", "Duong Le", "Bang Nguyen", "Hung Bui"];
// var phones = ["0916600220", "0987606236", "0888960522", "0913525525", "0888569869"];
//
// for (var i = 0; i < 5; i++) {
//   idocs[i] = {
//     name: names[i], phone: phones[i], secret: otplib.authenticator.generateSecret(), imageUrl =
//   }
// }
//
// MongoClient.connect(url, function (err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   const collection = db.collection('documents');
//   collection.insertMany(idocs, function (err, result) {
//     collection.find({}).toArray(function (err, docs) {});
//   });
//   client.close();
// });

//SINH RA QRCODE DUA VAO SECRET

qrgen_phone("0916600220",function(fdocs,imageUrl){
  console.log(fdocs);
  console.log(imageUrl);
});

function qrgen_phone (phone, callback){
  MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('documents');
    collection.find({phone: phone.toString()}).toArray(function (err, fdocs) {
      const secret = fdocs["0"].secret;
      qrgen_secret(secret,function(imageUrl){
        callback(fdocs,imageUrl);
      });
    });
    client.close();
  });
}
function qrgen_secret(secret, callback) {
  const otpauth = otplib.authenticator.keyuri('user', 'service', secret);
  qrcode.toDataURL(otpauth, (err, imageUrl) => {
    callback(imageUrl)
  });
}

// KẾT NỐI ĐẾN( MONGODB


// MongoClient.connect(url, function (err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   const collection = db.collection('documents');
//   // collection.insertMany(idocs, function (err, result) {
//   // collection.deleteOne({token: 949770}, function (err, result) {
//   //   assert.equal(err, null);
//   //   assert.equal(1, result.result.n);
//   //   console.log("Removed the document with the field a equal to 3");
//   // });
//   // collection.find({}).toArray(function (err, docs) {
//   //   console.log("Found the following records");
//   //   console.log(docs);
//   // });
//   collection.find({name: "Tri Trinh"}).toArray(function (err, docs) {
//     console.log(docs);
//     console.log("name   = "+docs["0"].name);
//     console.log("phone  = "+docs["0"].phone);
//     console.log("secret = "+docs["0"].secret);
//   });
//   client.close();
// });

//FUNCTION INSERT DOCUMENTS
const insertDocuments = function (db, collection, idocs, callback) {
  collection.insertMany(idocs, function (err, result) {
    console.log("Inserted documents %s into the collection", docs);
    callback(result);
  });
};
//FUNCTION FIND ALL DOCUMENTS
const findallDocuments = function (db, collection, callback) {
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
};
//FUNCTION FIND DOCUMENTS
const findDocuments = function (db, collection, fdocs, callback) {
  collection.find(fdocs).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};
//FUNCTION UPDATE DOCUMENTS
const updateDocument = function (db, collection, callback) {
  collection.updateOne({a: 2}
    , {$set: {b: 1}}, function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
};
//FUNCTION REMOVE DOCUMENTS
const removeDocument = function (db, collection, callback) {
  collection.deleteOne({a: 3}, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
};
//FUNCTION INDEX COLLECTION
const indexCollection = function (db, collection, callback) {
  db.collection('documents').createIndex(
    {"a": 1},
    null,
    function (err, results) {
      console.log(results);
      callback();
    }
  );
};

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Tao mot parser co dang application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(express.static('public'));

// Phuong thuc get() phan hoi mot GET Request ve Homepage
app.get('/', function (req, res) {
  console.log("Nhan mot GET Request ve Homepage");
  res.send('Hello GET');
})

// Phuong thuc post() phan hoi mot POST Request ve Homepage
app.post('/', function (req, res) {
  console.log("Nhan mot POST Request ve Homepage");
  res.send('Hello POST');
})

// Phuong thuc delete() phan hoi mot DELETE Request ve /del_user page.
app.delete('/del_user', function (req, res) {
  console.log("Nhan mot DELETE Request ve /del_user");
  res.send('Hello DELETE');
})

// Phuong thuc nay phan hoi mot GET Request ve /list_user page.
app.get('/list_user', function (req, res) {
  console.log("Nhan mot GET Request ve /list_user");
  res.send('Page Listing');
})

// Phuong thuc nay phan hoi mot GET Request ve abcd, abxcd, ab123cd, ...
app.get('/ab*cd', function (req, res) {
  console.log("Nhan mot GET request ve /ab*cd");
  res.send('Page Pattern Match');
})
app.get('/', function (req, res) {
  res.send('Hello World');
})

app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})
app.get('/process_get', function (req, res) {

  // Chuan bi output trong dinh dang JSON
  var response = {
    Phone: req.query.phone,
    OTP: req.query.otp
  };
  console.log(response);
  res.end(JSON.stringify(response));
})
app.post('/process_post', urlencodedParser, function (req, res) {

  // Chuan bi output trong dinh dang JSON
  var response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log("Ung dung Node.js dang lang nghe tai dia chi: http://%s:%s", host, port)

})
