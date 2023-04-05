// 导入数据库操作模块
const db = require('../db/index')

// 获取所有元器件列表
exports.getAllNewsList = (req, res) => {
  const sqlStr = 'select * from news_info'
  db.query(sqlStr, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 200,
      message: '获取新闻列表成功！',
      data: results,
    })
  })
}
