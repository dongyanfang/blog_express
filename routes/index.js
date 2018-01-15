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
     res.render('blog', {title:'111'});
    // alert();
});
//登录
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
            //req.session.user = user;
            res.redirect('/');
        }
    });
    // res.render('login');
});

//添加博客
router.post('/blog', function(req, res, next) {
    var title = req.body.title.toString();
    var content = req.body.content.toString();
    var classify = req.body.classify.toString() || 'html+css';

    var query = 'INSERT blog_list SET title='+ mysql.escape(title)+',content=' +mysql.escape(content)+',classify='+mysql.escape(classify)+',time=now(),authorId=1';
    mysql.query(query,function(err,rows,fields){
        if(err){
            console.log(err);
            return false;
        }
            res.redirect('/');
    });
    // res.render('login');
});
module.exports = router;
