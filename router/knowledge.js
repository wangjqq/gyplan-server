const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const knowledge_handler = require('../router_handler/knowledge')

// 获取知识列表
router.get('/knowledge/getKnowledgeList', knowledge_handler.getKnowledgeList)
// 获取数据结构/算法列表
router.get('/knowledge/getDataStructureList', knowledge_handler.getDataStructureList)
// 获取数据结构/算法知识点分类列表
router.get('/knowledge/getDataStructureKeyTypeList', knowledge_handler.getDataStructureKeyTypeList)

// 新增数据结构/算法知识点分类
router.post('/knowledge/addDataStructureKeyType', knowledge_handler.addDataStructureKeyType)
// 新增数据结构/算法的题目/知识点
router.post('/knowledge/addDataStructure', knowledge_handler.addDataStructure)

module.exports = router