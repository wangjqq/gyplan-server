const express = require('express')
const router = express.Router()

// 导入知识路由处理函数对应的模块
const ims_handler = require('../router_handler/ims')

// 获取所有元器件列表
router.get('/ims/getAllImsList', ims_handler.getAllImsList)
// 根据分类获取元器件列表
router.get('/ims/getImsListByType', ims_handler.getImsListByType)
// 获取元器件分类列表
router.get('/ims/getTypeList', ims_handler.getTypeList)
// 获取所有元器件使用列表
router.get('/ims/getAllUseList', ims_handler.getAllUseList)

// 添加元器件
router.post('/ims/addItem', ims_handler.addItem)
// 添加元器件分类
router.post('/ims/addItemType', ims_handler.addItemType)

module.exports = router