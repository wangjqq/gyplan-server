// 导入数据库操作模块
const db = require('../db/index')

// 查询更新信息
exports.getUpdateInfo = (req, res) => {
  console.log(req.query)
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.query
  // 定义查询语句
  const sqlStr = 'select * from system_update_info where location='+userinfo.location+' and auth='+userinfo.auth

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取更新信息成功！',
      data: results,
    })
  })
}

// 添加更新信息
exports.addUpdateInfo = (req, res) => {
  console.log(req.body)
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 定义查询语句
  const sqlStr = 'insert into system_update_info set ?'

  db.query(sqlStr, {
    info: userinfo.info,
    location: userinfo.location,
    type: userinfo.type,
    auth:userinfo.auth,
    version:userinfo.version
  }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '新增更新信息成功！',
      data: results,
    })
  })
}