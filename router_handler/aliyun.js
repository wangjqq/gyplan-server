// 导入数据库操作模块
const db = require('../db/index')
const Core = require('@alicloud/pop-core')

exports.sendSms = (req, res) => {
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10)
  }
  // console.log(req.body)
  const sql = `select * from users_login where sessionID=?`
  db.query(sql, req.sessionID, (err, results) => {
    var timestamp = Date.parse(new Date())
    const sql2 = `UPDATE users_login set ? WHERE id=` + results[0].id
    db.query(sql2, {
      smsCode: code,
      phoneNumber: req.body.phoneNumber,
      smsValidTime: timestamp
    }, (err, results) => {
      console.log(err)
      console.log(results)
    })

  })

  var client = new Core({
    accessKeyId: process.env.accessKeyId,
    accessKeySecret: process.env.secretAccessKey,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  })

  var params = {
    "PhoneNumbers": req.body.phoneNumber,
    "SignName": "元器件学习计划",
    "TemplateParam": `{\"code\":${code}}`,
    "TemplateCode": "SMS_270315360",
    "OutId": ""
  }

  var requestOption = {
    method: 'POST',
    formatParams: false,

  }

  // client.request('SendSms', params, requestOption).then((result) => {
  //   res.send(JSON.stringify(result))
  // }, (ex) => {
  //   res.send(ex)
  // })
}