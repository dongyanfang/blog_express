var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('./../database');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {

    res.render('login', {});
    // res.json({name:'zhangsan',age:18});
});
router.get('/blog', function(req, res, next) {
    var query = 'SELECT * FROM  blog_list';
    mysql.query(query,function(err,rows,fields){
        if(err){
            console.log(err);
            return false;
        }
        var user = rows;
        if(user){
            res.render('blog', {});
        }
    });
});
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // var hash = crypto.createHash('md5');
    // hash.update(password);
    // password = hash.digest('hex');
    var query = 'SELECT * FROM  author WHERE authorName='+ mysql.escape(username)+'AND authorPassword='+mysql.escape(password);
    mysql.query(query,function(err,rows,fields){
        if(err){
            console.log(err);
            return false;
        }
        var user = rows[0];
        if(user){
            res.redirect('/');
        }
    });
    // res.render('login');
});
module.exports = router;
