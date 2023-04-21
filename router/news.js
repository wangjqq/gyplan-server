const express = require('express')
const router = express.Router()

// 导入新闻接口处理函数对应的模块
const news_handler = require('../router_handler/news')

// 获取所有新闻列表
router.get('/news/getAllNewsList', news_handler.getAllNewsList)
// 根据id获取新闻详情
router.get('/news/getNewContentById', news_handler.getNewContentById)

module.exports = router
