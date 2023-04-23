const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const forum_handler = require('../router_handler/forum')

// 获取论坛分类列表
router.get('/forum/getForumTypeList', forum_handler.getForumTypeList)

// 根据分类获取帖子列表
router.get('/forum/getForumListByType', forum_handler.getForumListByType)

// 新增帖子
router.post('/forum/addForum', forum_handler.addForum)

// 获取最新帖子
router.get('/forum/getFreshForum', forum_handler.getFreshForum)

module.exports = router
