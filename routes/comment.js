var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var pagination = require('pagination');
const fs = require('fs');
const url = 'mongodb://localhost:27017';
const dbName = 'Comments';
/* GET users listing. */
router.post('/', function(req, res, next) {
    if (req.body.content!=undefined && req.body.content.length>0){
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
            // Insert a single document
            
            t = moment().format();
            db.collection('posts').insertOne({
                "time":t,
                "content": req.body.content
            },function(err, r) {
                if(r.result.ok)    
                    res.send("ok");
                else
                    res.send("fail");
                client.close();
            });
        });
    }
    else
        res.send('fail');
});

router.delete('/', function(req, res, next) {  //[Auth Required] delete content
    if(req.session.login&&req.session.admin&&req.query.id){
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
            // Insert a single document
            db.collection('posts').deleteOne( { "_id" : new ObjectID(req.query.id) } ,function(err, r) {
                if(r) 
                    res.send("ok");
                else
                    res.send("fail");
                client.close();
                });
        });
    }
    else{
        res.send("fail");
    }
});
router.patch('/', function(req, res, next) {  //[Auth Required] update or modify content
    if(req.session.login&&req.session.admin&&req.body.content&&req.body.content.length>0){
        MongoClient.connect(url, function(err, client) {
            const db = client.db(dbName);
            // Insert a single document
            db.collection('posts').updateOne( { "_id" : new ObjectID(req.body.id) } ,
            { $set: {content: req.body.content}},
                                        function(err, r) {   
                if(r.result.ok) 
                    res.send("ok");
                else
                    res.send("fail");
                client.close();
                });
        });
    }
    else{
        res.send("fail");
    }
});
router.get('/', function(req, res, next) {    //load
    let page = 0;
    let query = {}
    let num_of_posts_a_page = 10;
    if (!isNaN(req.query.p)){
        let tmp = parseInt(req.query.p)
        if(tmp > 0)
        page = tmp;
    }
    if (req.query.q!=undefined&&req.query.q.length>0){
        //TO-DOs: escape
        query = {$text: { $search: req.query.q ,$language:"none"}};
    }

    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);

        // Insert a single document
        let cursor = db.collection('posts')
                    .find(query)
                    .sort({"time":-1})
                    .skip(page*num_of_posts_a_page)
                    .limit((page+1)*num_of_posts_a_page);
        cursor.count(applySkipLimit=false,(err,num_of_row)=>{
            if(err){
                console.log(err);
                res.status(500).json({ error: 'DB Fails' });
                client.close();
            }
            else{
                cursor.toArray((err, r)=>{ 
                    let paginator = new pagination.SearchPaginator({prelink:'/',
                                                            current: page+1,
                                                            rowsPerPage: num_of_posts_a_page,
                                                            totalResult: num_of_row});
                    res.json({posts:r, page:paginator.getPaginationData()});
                    client.close();
                });
            }
        });
    });
});
module.exports = router;