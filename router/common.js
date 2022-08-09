const express = require('express')
const router = express.Router()

// 导入通用路由处理函数对应的模块
const common_handler = require('../router_handler/common')
router.post('/upload', common_handler.upload)
module.exports = router