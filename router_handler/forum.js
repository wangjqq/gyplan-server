// 导入数据库操作模块
const db = require('../db/index')

// 获取帖子分类列表
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

// 根据id获取帖子内容
exports.getForumContentById = (req, res) => {
  const userinfo = req.query
  const sqlStr = 'select * from forum_list where id=' + userinfo.id
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '根据id获取帖子内容!',
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

// // 获取最新回复
// exports.getFreshReply = (req, res) => {
//   const sqlStr = 'SELECT DISTINCT fid FROM forum_reply ORDER BY id DESC LIMIT 5'
//   db.query(sqlStr, (err, results) => {
//     // 执行 SQL 语句失败
//     if (err) {
//       return res.cc(err)
//     }
//     res.send({
//       status: 200,
//       message: '获取最新回复成功！',
//       data: results,
//     })
//   })
// }

// 获取最新回复
exports.getFreshReply = (req, res) => {
  const sqlStr =
    'SELECT forum_reply.*, forum_list.title FROM (SELECT MAX(id) AS max_id, fid FROM forum_reply GROUP BY fid) AS tmp JOIN forum_reply ON tmp.max_id = forum_reply.id JOIN forum_list ON forum_reply.fid = forum_list.id ORDER BY forum_reply.id DESC LIMIT 5'
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取最新回复成功！',
      data: results,
    })
  })
}

// 回复帖子
exports.replyForum = (req, res) => {
  const userinfo = req.body
  const sqlStr = `insert into forum_reply set ?`
  const sqlStr1 = `UPDATE forum_list set ? WHERE id=${userinfo.fid}`
  db.query(sqlStr, userinfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    db.query(
      sqlStr1,
      { lastReplyTime: userinfo.replyTime, lastReplyName: userinfo.replyName, lastReplyId: userinfo.replyId },
      (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
          return res.cc(err)
        }
      }
    )
    res.send({
      status: 200,
      message: '回复帖子成功！',
      data: results,
    })
  })
}

// 获取帖子回复列表
exports.getForumReplyList = (req, res) => {
  const userinfo = req.query
  const sqlStr = `select * from  forum_reply where fid=${userinfo.fid}`
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    const total = results.length
    const sqlStr1 = `select * from  forum_reply where fid=${userinfo.fid} limit ${
      (userinfo.page - 1) * userinfo.size
    } ,${userinfo.page * userinfo.size}`
    db.query(sqlStr1, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      res.send({
        status: 200,
        message: '获取帖子回复成功！',
        data: {
          total,
          results,
        },
      })
    })
    // 执行 SQL 语句失败
  })
}

// 查看帖子
exports.viewForum = (req, res) => {
  const userinfo = req.body
  const sqlStr = `UPDATE  forum_list set ? where id=${userinfo.id}`
  db.query(sqlStr, userinfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '查看帖子成功！',
      data: results,
    })
  })
}

// 点赞回复的帖子
exports.likesForum = (req, res) => {
  const userinfo = req.body
  const sqlStr = `UPDATE  forum_reply set ? where id=${userinfo.id}`
  db.query(sqlStr, userinfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '点赞帖子成功！',
      data: results,
    })
  })
}

// 删除帖子
exports.delForum = (req, res) => {
  const userinfo = req.body
  const sqlStr = `DELETE FROM forum_list WHERE id = ${userinfo.id}`
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '删除帖子成功！',
      data: results,
    })
  })
}

// 删除回复
exports.delReply = (req, res) => {
  const userinfo = req.body
  const sqlStr = `DELETE FROM forum_reply WHERE id = ${userinfo.id}`
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '删除回复成功！',
      data: results,
    })
  })
}
