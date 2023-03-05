// 导入数据库操作模块
const db = require('../db/index')

exports.init = () => {
  const sql = 'delete from users_login' //初始化删除登陆临时表

  db.query(sql, (err, results) => {
    // console.log(err)
    // console.log(results)
  })
}