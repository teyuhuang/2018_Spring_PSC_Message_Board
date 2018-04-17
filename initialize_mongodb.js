var MongoClient=require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/Comments",function(err,db){
 
   if(err) throw err;
   //Write databse Insert/Update/Query code here..
 
   db.collection('posts',function(err,collection){
    if(err){
      console.log(err);
      return;
    }
    collection.insert({ id:1, time:'2017-09-10', content:'I am good!!' });
    collection.insert({ id:2, time:'2017-09-13', content:'I am bad!!' });
    collection.insert({ id:3, time:'2017-09-11', content:'I am mm!!' });
 
    collection.count(function(err,count){
        if(err) throw err;
        console.log('Total Rows:'+count);
    });
  });
  db.close();
});