var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var ueditor = require('ueditor');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ueditor
app.use("/libs/ueditor/getImg", ueditor(path.join(__dirname, 'public'), function (req, res, next) {

    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/upload';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }

    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/upload';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }

    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/libs/ueditor/nodejs/config.json')
    }

}));

// sesssion应用的配置
app.use(session({
    secret:'blog',
    resave:true,
    saveUninitialized:true
}));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,function(){
  console.log('listening port 300');
})
module.exports = app;
