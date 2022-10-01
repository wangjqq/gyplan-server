const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const tencentcloud_handler = require('../router_handler/tencentcloud')

// 发送短信
router.post('/user/tencentcloud/getSms', tencentcloud_handler.getSms)

module.exports = router