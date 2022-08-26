// 导入 express
const express = require('express')
const https = require('https')
const multer = require('multer')
// 创建服务器的实例对象
const app = express()

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
const options = {
  rejectUnauthorized: false
}
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({
  extended: false
}))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
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

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
  console.log('api服务器已启动于 http://127.0.0.1:3007')
})

// https.createServer(options, app).listen(3007, () => {
//   console.log('Server Running');
// })