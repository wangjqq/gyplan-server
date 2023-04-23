// 导入数据库操作模块
const db = require('../db/index')

exports.getForumTypeList = (req, res) => {
  const sqlStr = 'select * from forum_type'

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取论坛分类成功！',
      data: results,
    })
  })
}

// 根据分类获取帖子列表
exports.getForumListByType = (req, res) => {
  const userinfo = req.query
  const sqlStr = 'select * from forum_list where typeId=' + userinfo.typeId
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '根据分类获取帖子列表成功!',
      data: results,
    })
  })
}

// 新增帖子
exports.addForum = (req, res) => {
  const userinfo = req.body
  const sqlStr = `insert into forum_list set ?`
  db.query(sqlStr, userinfo, (err, results) => {
    const sqlStr1 = `select * from forum_type where id=${userinfo.typeId}`
    db.query(sqlStr1, (err, results) => {
      const sqlStr2 = `UPDATE forum_type set ? WHERE id=${results[0].id}`
      db.query(sqlStr2, { number: results[0].number + 1 }, (err, results) => {})
    })
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '创建帖子成功！',
      data: results,
    })
  })
}

// 获取最新帖子
exports.getFreshForum = (req, res) => {
  const sqlStr = `select * from forum_list order by id desc LIMIT 5`
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取最新帖子成功！',
      data: results,
    })
  })
}

// 根据id查询帖子详情
exports.getFreshForum = (req, res) => {
  const sqlStr = `select * from forum_list order by id desc LIMIT 5`
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取最新帖子成功！',
      data: results,
    })
  })
}
