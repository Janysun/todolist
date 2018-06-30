var user = require('./users').user;
exports.index = function (req, res) {
    res.render('index', {
        title: '首页',
        home: 'Home',
        login: 'Login'
    });
};
exports.login = function (req, res) {
    res.render('login', {
        title: '用 户 登 录'
    });
};

exports.goHome = function(req, res){
    if(req.session.user){
        res.render('home',{
             title: 'Home',
             user: user.userid
        });
    }else{
        req.session.error = "请先登录"
        res.render('login',{
            title: '用 户 登 录'
        });
    }
}

exports.doLogin = function (req, res, next) {
    if (req.body.userid === user.userid && req.body.password === user.password) {
        req.session.user = user;
        return res.render('home',{
            title: 'Home',
            user: user.userid
        });
    } else {
        // return res.render('login', {
        //     title: '用 户 登 录'
        // });
        req.session.error = "用户名或密码错误!";
        res.state(500);
        res.redirect('login',{
            message: err
        });
    }
};

exports.logout = function (req, res) {
    req.session.user = null;
    req.session.error = null;
    res.render('login',{
        title: '用户登录'
    });
};