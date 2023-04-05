const express = require('express')
const router = express.Router()

// 导入系统接口处理函数对应的模块
const news_handler = require('../router_handler/news')

// 获取所有新闻列表
router.get('/news/getAllNewsList', news_handler.getAllNewsList)

module.exports = router
