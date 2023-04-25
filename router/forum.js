const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const forum_handler = require('../router_handler/forum')

// 获取论坛分类列表
router.get('/forum/getForumTypeList', forum_handler.getForumTypeList)

// 根据分类获取帖子列表
router.get('/forum/getForumListByType', forum_handler.getForumListByType)

// 根据id获取帖子内容
router.get('/forum/getForumContentById', forum_handler.getForumContentById)

// 新增帖子
router.post('/forum/addForum', forum_handler.addForum)

// 获取最新帖子
router.get('/forum/getFreshForum', forum_handler.getFreshForum)

// 获取最新回复
router.get('/forum/getFreshReply', forum_handler.getFreshReply)

// 回复帖子
router.post('/forum/replyForum', forum_handler.replyForum)

// 获取帖子回复列表
router.get('/forum/getForumReplyList', forum_handler.getForumReplyList)

// 查看帖子
router.post('/forum/viewForum', forum_handler.viewForum)

// 点赞帖子
router.post('/forum/likesForum', forum_handler.likesForum)

// 删除帖子
router.post('/forum/delForum', forum_handler.delForum)

// 删除回复
router.post('/forum/delReply', forum_handler.delReply)

module.exports = router
