const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const aliyun_handler = require('../router_handler/aliyun')

// 发送短信
router.post('/user/aliyun/sendSms', aliyun_handler.sendSms)

module.exports = router