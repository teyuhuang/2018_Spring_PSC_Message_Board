var express = require('express');
var router = express.Router();
const fs = require('fs');
/* GET users listing. */
router.get('/', function(req, res, next) {    //index
  res.sendFile('views/index.html',{ root : __dirname+"/../"});
});
router.post('/login',function(req,res,next){
  var MongoClient=require('mongodb').MongoClient;
  const url = 'mongodb://localhost:27017';
  const dbName = 'Comments';
  const crypto = require('crypto');
  const secret = 'lalalala';
  if(req.body.user!=undefined&&req.body.pass!=undefined
    &&req.body.user.length>0&&req.body.pass.length>0){
      
      const hash = crypto.createHmac('sha256', secret)
      .update(req.body.pass)
      .digest('hex');

      MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        // Insert a single document
        db.collection('Users').findOne(
          {$and:[{"username":req.body.user},
                            {"pwd":hash}]},
                      function(err, r) {    
          if(r!=null){
            req.session.login = true;
            if(r.admin){
              req.session.admin = true;
              res.send("admin");
            }
            else
              res.send("ok");
          }
          else
            res.send("fail");
          client.close();
        });
      });
  }
  else if(req.session.login){
    if(req.session.admin)
      res.send("admin");
    else
      res.send("ok");
  }
  else{
    res.send("fail");
  }
});
router.post('/logout',function(req,res,next){
  req.session.login = false;
  req.session.admin = false;
  res.send("ok");
});
module.exports = router;