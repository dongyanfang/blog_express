var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('./../database');
var http = require('http');
var url = require('url');
var queryString = require('querystring');
/* GET home page. */
// 首页
router.get('/', function(req, res, next) {
    var current_page = req.query.page||1;
    var num =10;
    var start = (current_page-1)*num;
    var end = current_page*num;
    var page_num =0;
    var total_page =0;
    var list_num='SELECT COUNT(*) AS total_page FROM blog_list';
    mysql.query(list_num,function(err,rows,fields){
        total_page = rows[0].total_page;
        page_num=Math.ceil(total_page/num);
    });
    if(queryString.parse(url.parse(req.url).query).page){
        current_page = queryString.parse(url.parse(req.url).query).page;
    }
    var query = 'SELECT * FROM  blog_list limit ' + start +','+end;
    mysql.query(query,function(err,rows,fields){
        if(err){
            console.log(err);
            return false;
        }
        var blog_list=rows;
        res.render('index', {
            currrent_page:current_page,
            data:blog_list,
            total_page:total_page,
            page_num:page_num
        });
    });

    // res.json(req.session.username);
});
// 登录页
router.get('/login', function(req, res, next) {
    res.render('login', {message:'',title:'111'});
});
// 博客添加页
router.get('/blog', function(req, res, next) {
    if(!req.session.username){
        res.render('login', {message:'',title:'111'});
    }else{
        if(req.query.id){
            var id = queryString.parse(url.parse(req.url).query).id;
            var query = 'SELECT * FROM  blog_list WHERE id='+id;
            mysql.query(query,function(err,rows,fields) {
                if (err) {
                    console.log(err);
                    return false;
                }
                var blog_details = rows[0];
                res.render('blog', {blog_details :blog_details});
            });
        }else{
            res.render('blog', {blog_details :{title:'',content:''}});
        }
    }

    // alert();
});
// 博客详情页
router.get('/blog_detail', function(req, res, next) {
    var id = queryString.parse(url.parse(req.url).query).id;
    var query = 'SELECT * FROM  blog_list WHERE id='+id;
    mysql.query(query,function(err,rows,fields){
        if(err){
            console.log(err);
            return false;
        }
        var blog_details=rows[0];
       //  console.log(blog_details);
        res.render('blog_detail', {blog_detail:blog_details});
    });
    // alert();
});
// 登录
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
            req.session.username=user.authorName;
            res.redirect('/blog');
        }else{
            res.render('login',{message:'用户名或者密码不正确'});
        }
    });
    // res.render('login');
});

// 添加博客
router.post('/blog', function(req, res, next) {
    var title = req.body.title.toString();
    var content = req.body.editor.toString();
    var classify = req.body.classify.toString() || 'html+css';
    if(req.query.id){
        var query = 'UPDATE blog_list SET title='+ mysql.escape(title)+',content=' +mysql.escape(content)+',classify='+mysql.escape(classify)+',time=now(),authorId=1 WHERE id='+ req.query.id;
        mysql.query(query,function(err,rows,fields){
            if(err){
                console.log(err);
                return false;
            }
            res.redirect('/blog_detail?id='+req.query.id);
        });
    }else{
        var query = 'INSERT blog_list SET title='+ mysql.escape(title)+',content=' +mysql.escape(content)+',classify='+mysql.escape(classify)+',time=now(),authorId=1';
        mysql.query(query,function(err,rows,fields){
            if(err){
                console.log(err);
                return false;
            }
            res.redirect('/');
        });
    }
});
module.exports = router;
