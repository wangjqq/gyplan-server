// 导入 express
const fs = require('fs')
const https = require('https')
const path = require('path')

const express = require('express')

const multer = require('multer')
const joi = require('joi')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const app = express()
const options1 = {
  key: fs.readFileSync('./public/ssl/wangjingqi.top.key'),
  cert: fs.readFileSync('./public/ssl/wangjingqi.top_bundle.pem'),
}
var server = https.createServer(options1, app)
const compression = require('compression')
app.use(compression()) // 在其他中间件使用之前调用

app.use(express.static('C:/wwwroot/images')) // 设置静态图片访问的路径

let dotenv = require('dotenv')
dotenv.config('./env')
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors({
  // origin: 'https://wangjingqi.top',
  origin: 'https://localhost:8080',
  credentials: true
}))
app.use(cookieParser('secret'))
app.use(session({
  secret: 'secret', // 对session id 相关的cookie 进行签名
  resave: true,
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // 设置 session 的有效时间，单位毫秒,12小时
    // maxAge: 1000 * 30, // 设置 session 的有效时间，单位毫秒,30秒
  },
}))
// 创建服务器的实例对象


const options = {
  rejectUnauthorized: false
}
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({
  extended: false
}))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  console.log(req.sessionID)
  console.log(req.originalUrl)
  // console.log(req.originalUrl)
  if (req.headers.from != "wxmp" && ((req.originalUrl.split('/')[1] != 'user' && req.originalUrl.split('/')[1] != 'system') || req.originalUrl.split('/')[2] == 'islogin' || req.originalUrl.split('/')[2] == 'logout')) {
    if (req.session.user != undefined) {
      if (req.session.user.login != 1) {
        res.send({
          status: 201,
          message: "登录过期,请重新登录",
        })
        return
      }
    } else {
      res.send({
        status: 202,
        message: "请登录",
      })
      return
    }
  }

  // status 默认值为 500，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 500) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

var objMulter = multer({
  dest: './upload/'
})
app.use(objMulter.any())

// 导入并使用知识模块
const knowledgeRouter = require('./router/knowledge')
app.use('/api', knowledgeRouter)

// 导入并使用通用模块
const commonRouter = require('./router/common')
app.use('/api', commonRouter)

// 导入并使用元器件管理模块
const imsRouter = require('./router/ims')
app.use('/api', imsRouter)

// 导入并使用短信模块
const tencentcloudRouter = require('./router/tencentcloud')
app.use(tencentcloudRouter)

// 导入并使用系统模块
const systemRouter = require('./router/system')
app.use(systemRouter)

// 导入并使用用户路由模块
const userRouter = require('./router/user')
const {
  required
} = require('joi')
app.use(userRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 未知的错误
  res.cc(err)
})


// 启动服务器
app.listen(3000, () => {
  console.log('api服务器已启动于 http://127.0.0.1')
})
server.listen(3007, () => {
  console.log('api服务器已启动于 https://127.0.0.1:3007')
})