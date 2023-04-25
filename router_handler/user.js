// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs这个包
const bcrypt = require('bcryptjs')
// 导入生成hash值的包
const crypto = require('crypto')
// 导入生成hash头像的包
const Identicon = require('identicon.js')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // console.log(req.session)
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body

  // 定义SQL语句,查询用户名是否被占用
  const sqlStr = 'select * from users_info where username=?'
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
    const sql = 'insert into users_info set ?'
    let hash = crypto.createHash('md5')
    hash.update(userinfo.username) // 传入用户名
    let imgData = new Identicon(hash.digest('hex')).toString()
    let imgUrl = 'data:image/png;base64,' + imgData // 这就是头像的base64码
    // 调用db.squery()执行SQL语句
    db.query(
      sql,
      {
        username: userinfo.username,
        password: userinfo.password,
        user_pic: imgUrl,
      },
      (err, results) => {
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
      }
    )
  })

  // res.send('reguser OK')
}
//登录的处理函数
exports.login = (req, res) => {
  // 接受表单的数据
  // console.log(req)
  let userinfo = req.body

  //  验证验证码
  // req.session.capdata.trim()
  // userinfo.captcha.trim()
  // console.log(typeof req.session.capdata + '~~~~' + typeof userinfo.capdata)
  // if (userinfo.captcha.trim() != req.session.capdata.trim()) {
  //     res.cc('验证码错误')
  //     console.log('验证码错误')
  //     return
  // }
  // 定义SQL数据
  const sql = 'select * from users_info where username=?'
  console.log(req.query)
  // 执行SQL语句
  db.query(sql, userinfo.username, (err, results) => {
    // 执行SQL语句失败
    if (err) {
      return res.cc(err)
    }
    // 执行SQL语句成功,但是获取到的数据条数不等于1
    if (results.length !== 1) {
      return res.cc('登陆失败,没有此账号')
    }
    // TODO:判断密码是否正确
    // console.log(userinfo.password);
    // console.log(results[0].password);
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // console.log(compareResult);
    if (!compareResult) {
      return res.cc('登陆失败,密码错误!')
    }
    // 登陆成功
    var myDate = new Date()
    var id = results[0].id
    var name = results[0].username
    const sql1 = 'select * from user_session where userId=?'
    db.query(sql1, results[0].id, (err, results) => {
      if (results.length == 1) {
        var loginNum1 = results[0].loginNum
        const sql2 = `UPDATE user_session set ? WHERE userId=` + id
        console.log(sql2)
        // (isLogin, loginTime, dueTime, loginNum) values ("1", '${myDate.toLocaleString()}', '${myDate.toLocaleString()}', '${results[0]+1}')
        db.query(
          sql2,
          {
            isLogin: '1',
            loginTime: myDate.toLocaleString(),
            dueTime: myDate.toLocaleString(),
            loginNum: loginNum1 + 1,
          },
          (err, results) => {}
        )
      } else {
        const sql2 = `insert into user_session set ? `
        // (isLogin, loginTime, dueTime, loginNum) values ("1", '${myDate.toLocaleString()}', '${myDate.toLocaleString()}', '${results[0]+1}')
        db.query(
          sql2,
          {
            userId: id,
            isLogin: '1',
            loginTime: myDate.toLocaleString(),
            dueTime: myDate.toLocaleString(),
            loginNum: '1',
            userName: name,
          },
          (err, results) => {}
        )
      }
    })
    req.session.user = {
      userId: id,
      username: userinfo.username,
      login: 1,
    }
    res.send({
      status: 200,
      message: '登录成功！',
    })
  })
}

//登录的处理函数
exports.login1 = (req, res) => {
  let userinfo = req.body
  const sql = 'select * from users_login where sessionID=?'
  db.query(sql, req.sessionID, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    let dbData = results[0]
    if (
      dbData &&
      dbData.phoneNumber === userinfo.phoneNumber &&
      dbData.smsCode === userinfo.phoneCode &&
      dbData.picCode === userinfo.captcha
    ) {
      const sql1 = 'select * from users_info where phoneNumber=?'
      db.query(sql1, userinfo.phoneNumber, (err, results) => {
        let myDate = new Date()
        console.log(results)
        if (results.length === 1) {
          const sql2 = `UPDATE users_info set ? WHERE phoneNumber=` + userinfo.phoneNumber
          db.query(
            sql2,
            {
              isLogin: '1',
              loginTime: myDate.toLocaleString(),
              dueTime: myDate.toLocaleString(),
              loginNum: parseInt(results[0].loginNum) + 1,
              sessionID: req.sessionID,
            },
            (err, results) => {}
          )
        } else {
          const sql3 = `insert into users_info set ? `
          let hash = crypto.createHash('md5')
          hash.update(userinfo.phoneNumber) // 传入用户名
          let imgData = new Identicon(hash.digest('hex')).toString()
          let imgUrl = 'data:image/png;base64,' + imgData // 这就是头像的base64码
          db.query(
            sql3,
            {
              isLogin: '1',
              loginTime: myDate.toLocaleString(),
              dueTime: myDate.toLocaleString(),
              loginNum: '1',
              phoneNumber: userinfo.phoneNumber,
              userPic: imgUrl,
            },
            (err, results) => {
              console.log(err)
              console.log(results)
            }
          )
        }
        res.send({
          status: 200,
          message: '登录成功！',
        })
        return
      })
    } else {
      return res.cc('登陆失败,请检查输入的内容并尝试重新登陆!')
    }
  })
}

//发送验证码的处理函数
exports.captcha = (req, res) => {
  var codeConfig = {
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: Math.floor(Math.random() * 5), //干扰线条数目_随机0-5条
    height: 50, //验证码高度
    inverse: false, //反转验证码
    fontSize: 50, //验证码字体大小
    color: true, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
    // background: '#ccc' //背景色
  }
  var svgCaptcha = require('svg-captcha')
  var captcha = svgCaptcha.create(codeConfig)
  res.type('svg')
  res.status(200).send(captcha.data)
  const sql = `select * from users_login where sessionID=?`
  db.query(sql, req.sessionID, (err, results) => {
    // console.log(err)
    if (results.length === 0) {
      const sql1 = 'insert into users_login set ?'
      db.query(
        sql1,
        {
          picCode: captcha.text.toLowerCase(),
          sessionID: req.sessionID,
        },
        (err, results) => {}
      )
    } else {
      const sql2 = `UPDATE users_login set ? WHERE id=` + results[0].id
      db.query(
        sql2,
        {
          picCode: captcha.text.toLowerCase(),
        },
        (err, results) => {}
      )
    }
  })
}

//用户是否登录的处理函数
exports.islogin = (req, res) => {
  const sql = 'select * from users_info where sessionID=?'
  // 执行SQL语句
  db.query(sql, req.sessionID, (err, results) => {
    res.send({
      status: 200,
      data: [
        {
          dueTime: '2023/3/6 10:59:42',
          email: null,
          id: 52,
          isLogin: '1',
          loginNum: '15',
          loginTime: '2023/3/6 10:59:42',
          nickName: '顾渊',
          password: null,
          phoneNumber: '18011312502',
          qqNumber: null,
          sessionID: 'T70IKXbhV3wCTM26h0NJBmKQenIzJJDu',
          userPic:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEXw8PAmt9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbr5ehAAABAHRSTlP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKmfXxgAAEEtJREFUeNoBQBC/7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+bUETURD3KkAAAAASUVORK5CYII=',
        },
      ],
      message: '返回成功,已登录',
    })
    return

    // if (results.length === 1) {
    //     res.send({
    //         status: 200,
    //         data: results,
    //         message: '返回成功,已登录'
    //     })
    //     return
    // } else {
    //     res.send({
    //         status: 202,
    //         message: "请登录",
    //     })
    //     return
    // }
  })
}

//退出登录的处理函数
exports.logout = (req, res) => {
  var myDate = new Date()
  const sql = `UPDATE users_info set ? WHERE sessionID=` + req.sessionID
  // 执行SQL语句
  db.query(
    sql,
    {
      isLogin: '0',
    },
    (err, results) => {
      req.session.destroy()
      res.status(200).send({
        message: '退出登陆成功',
      })
    }
  )
}

//修改昵称的处理函数
exports.setUserInfo = (req, res) => {
  const sql = `UPDATE users_info set ? WHERE id=` + req.body.id
  // 执行SQL语句
  db.query(sql, req.body, (err, results) => {
    res.status(200).send({
      status: 200,
      data: results,
      message: '修改成功',
    })
  })
}
