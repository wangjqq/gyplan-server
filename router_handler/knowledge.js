// 导入数据库操作模块
const db = require('../db/index')

// 获取知识分组列表
exports.getKnowledgeList = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  // const userinfo = req.body
  // 定义查询语句
  const sqlStr = 'select * from knowledge_info'

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取知识列表成功！',
      data: results,
    })
  })
}

// 获取算法/数据结构列表
exports.getDataStructureList = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  // const userinfo = req.body
  // 定义查询语句
  const sqlStr = 'select * from datastructure_info'

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取数据结构/算法列表成功！',
      data: results,
    })
  })
}

// 获取数据结构/算法知识点分类列表
exports.getDataStructureKeyTypeList = (req, res) => {
  // 定义查询语句
  const sqlStr = 'select * from datastructure_key_type'

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '数据结构/算法知识点分类列表成功！',
      data: results,
    })
  })
}

// 新增数据结构/算法知识点分类
exports.addDataStructureKeyType = (req, res) => {
  const userinfo = req.body
  // 定义新增语句
  const sqlStr = `insert into datastructure_key_type set ?`

  db.query(sqlStr, {
    name: userinfo.name,
    father_id: userinfo.father_id
  }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '添加数据结构/算法知识点分类成功！',
      data: results,
    })
  })
}