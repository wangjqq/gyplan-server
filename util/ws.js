// 导入数据库操作模块
const db = require('../db/index')
const WebSocket = require('ws').Server
wss = new WebSocket({ host: 'localhost', port: 8089 })
wss.on('connection', function (ws) {
  //连接成功
  const sqlStr = 'select * from order_info'
  db.query(sqlStr, (err, results) => {
    ws.send(JSON.stringify(results), (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`)
      }
    })
  })
  ws.on('message', function (message) {
    let myDate = new Date()
    var resData = JSON.parse(message)
    const sqlStr1 = `insert into order_info set ?`
    db.query(
      sqlStr1,
      {
        phoneNumber: resData.phoneNumber,
        message: resData.message,
        time: myDate.toLocaleString(),
        pic: resData.pic,
      },
      (err1, results1) => {
        const sqlStr = 'select * from order_info'
        db.query(sqlStr, (err, results) => {
          ws.send(JSON.stringify(results), (err) => {
            if (err) {
              console.log(`[SERVER] error: ${err}`)
            }
          })
        })
      }
    )
  })
})
