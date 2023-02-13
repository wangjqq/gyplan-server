const express = require('express')
const router = express.Router()

// 导入系统接口处理函数对应的模块
const system_handler = require('../router_handler/system')

// 获取更新信息
router.get('/system/getUpdateInfo', system_handler.getUpdateInfo)

// 添加更新信息
router.post('/system/addUpdateInfo', system_handler.addUpdateInfo)

module.exports = router