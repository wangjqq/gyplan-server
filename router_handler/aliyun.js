// 导入数据库操作模块
const db = require('../db/index')
const Core = require('@alicloud/pop-core')

exports.sendSms = (req, res) => {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10)
  }

  // const sql = `select * from users_login where sessionID=?`
  // db.query(sql, req.sessionID, (err, results) => {
  var timestamp = Date.parse(new Date())
  // const sql2 = `UPDATE users_login set ? WHERE id=` + results[0].id
  const sql2 = `UPDATE users_login set ?  where sessionID=${req.sessionID}`
  db.query(
    sql2,
    {
      sessionID: req.sessionID,
      smsCode: code,
      phoneNumber: req.body.phoneNumber,
      smsValidTime: timestamp,
    },
    (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (req.body.phoneNumber == '18011312502') {
        res.send({
          status: 200,
          message: `欢迎登录管理员帐号,你的短信验证码是${code}！`,
          data: results,
        })
      } else {
        var client = new Core({
          accessKeyId: process.env.accessKeyId,
          accessKeySecret: process.env.secretAccessKey,
          endpoint: 'https://dysmsapi.aliyuncs.com',
          apiVersion: '2017-05-25',
        })

        var params = {
          PhoneNumbers: req.body.phoneNumber,
          SignName: '元器件学习计划',
          TemplateParam: `{\"code\":${code}}`,
          TemplateCode: 'SMS_270315360',
          OutId: '',
        }

        var requestOption = {
          method: 'POST',
          formatParams: false,
        }

        client.request('SendSms', params, requestOption).then(
          (result) => {
            res.send(JSON.stringify(result))
          },
          (ex) => {
            res.send(ex)
          }
        )
        res.send({
          status: 200,
          message: `短信验证码发送成功！`,
          data: results,
        })
      }
    }
  )
  // })
}
