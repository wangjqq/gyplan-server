// 导入数据库操作模块
const db = require('../db/index')

// 获取所有元器件列表
exports.getAllImsList = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  // const userinfo = req.body
  // 定义查询语句
  const sqlStr = 'select * from ims_info where ?'

  db.query(sqlStr, {
    user_id: req.session.user.userId
  }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取元器件列表成功！',
      data: results,
    })
  })
}
// 根据分类获取元器件列表
exports.getImsListByType = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.query
  // 定义查询语句
  const sqlStr = `select * from ims_info where type_id=${userinfo.type_id} and user_id=${req.session.user.userId}`
  console.log(userinfo.type_id, req.session.user.userId)
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取元器件列表成功！',
      data: results,
    })
  })
}
// 获取元器件分类列表
exports.getTypeList = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  // const userinfo = req.body
  // 定义查询语句
  const sqlStr = `select * from ims_type where type_user_id in (0,${req.session.user.userId})`

  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取元器件分类列表成功！',
      data: results,
    })
  })
}

// 新增元器件
exports.addItem = (req, res) => {
  const userinfo = req.query
  // 定义新增语句
  const sqlStr = `insert into ims_info set ?`
  db.query(sqlStr, {
    type_id: userinfo.type_id,
    type_name: userinfo.type_name,
    type_father_id: userinfo.type_father_id,
    package: userinfo.package,
    voltage: userinfo.voltage,
    electricity: userinfo.electricity,
    description: userinfo.description,
    name: userinfo.name,
    quantity: userinfo.quantity,
    price: userinfo.price,
    smt: userinfo.smt,
    size: userinfo.size,
    place: userinfo.place,
    user_id: req.session.user.userId
  }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '添加元器件成功！',
      data: results,
    })
  })
}

// 新增元器件分类
exports.addItemType = (req, res) => {
  const userinfo = req.query
  // 定义新增语句
  const sqlStr = `insert into ims_type set ?`
  db.query(sqlStr, {
    type_name: userinfo.type_name,
    type_father_id: userinfo.type_father_id,
    type_user_id: req.session.user.userId
  }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '添加元器件分类成功！',
      data: results,
    })
  })
}