const Core = require('@alicloud/pop-core')
exports.sendSms = (req, res) => {

  console.log(req.body)
  var client = new Core({
    accessKeyId: process.env.accessKeyId,
    accessKeySecret: process.env.secretAccessKey,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  })

  var params = {
    "PhoneNumbers": req.body.number,
    "SignName": "元器件学习计划",
    "TemplateParam": `{\"code\":${req.body.code}}`,
    "TemplateCode": "SMS_270315360",
    "OutId": ""
  }

  var requestOption = {
    method: 'POST',
    formatParams: false,

  }

  client.request('SendSms', params, requestOption).then((result) => {
    res.send(JSON.stringify(result))
  }, (ex) => {
    res.send(ex)
  })
}