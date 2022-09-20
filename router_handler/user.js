// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs这个包
const bcrypt = require('bcryptjs')
// 注册新用户的处理函数
exports.regUser = (req, res) => {
    console.log(req.session)
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body

    // console.log(req.sessionID)
    // console.log(userinfo);
    // 对表单中的数据,进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 1,
    //         message: '用户名或密码不合法'
    //     })
    // }


    // 定义SQL语句,查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err, message
            // })
            return res.cc(err)
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用,请更换其他用户名!'
            // })
            return res.cc('用户名被占用,请更换其他用户名!')
        }
        // 用户名可以使用
        // 调用bcrypt.hashSync()对密码进行加密
        // console.log(userinfo);

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 定义插入新用户的SQL语句
        const sql = 'insert into ev_users set ?'
        // 调用db.squery()执行SQL语句
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            // 判断SQL语句是否执行成功
            if (err) {
                // return res.send({
                //     status: 1,
                //     message: err, message
                // })
                return res.cc(err)
            }
            // 判断影响行数是否为1
            // console.log(results.affectedRows);
            if (results.affectedRows !== 1) {
                // return res.send({
                //     status: 1,
                //     message: '注册用户失败,请稍后再试!'
                // })
                return res.cc('注册用户失败,请稍后再试!')

            }
            // 注册用户成功
            // res.send({ status: 0, message: '注册成功' })
            // console.log(userinfo);
            res.send({
                status: 200,
                message: '注册成功！',
            })
        })

    })

    // res.send('reguser OK')
}
//登录的处理函数
exports.login = (req, res) => {
    // 接受表单的数据
    const userinfo = req.body
    // 定义SQL数据
    // console.log(req.body, req.session)
    if (userinfo.captcha != req.session.capdata) {
        return res.cc('验证码错误')
    }
    const sql = 'select * from ev_users where username=?'
    // 执行SQL语句
    db.query(sql, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }
        // 执行SQL语句成功,但是获取到的数据条数不等于1
        if (results.length !== 1) {
            return res.cc('登陆失败')
        }
        // TODO:判断密码是否正确
        // console.log(userinfo.password);
        // console.log(results[0].password);
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // console.log(compareResult);
        if (!compareResult) {
            return res.cc('登陆失败!')
        }
        req.session.user = {
            username: userinfo.username,
            login: 1,
        }; // session 存储验证码数值

        res.send({
            status: 200,
            message: '登录成功！',
        })
    })


}
//发送验证码的处理函数
exports.captcha = (req, res) => {
    var svgCaptcha = require('svg-captcha');
    var captcha = svgCaptcha.create();
    req.session.capdata = captcha.text.toLowerCase(); // session 存储验证码数值
    // req.session.save()
    // console.log(req.session)
    // console.log(req.sessionID)

    // if (null == req.session[sessionConstant.login]) {

    //     req.session[sessionConstant.login] = {};

    // }

    res.setHeader("Access-Control-Expose-Headers", "session_key");
    // res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
    res.setHeader('session_key', '123')
    // res.setHeader(" Access-Control-Allow-Credentials", true);
    // res.setHeader(" Access-Control-Allow-Origin", 'http://localhost:8080/');

    res.type('svg');
    res.status(200).send(captcha.data);
}