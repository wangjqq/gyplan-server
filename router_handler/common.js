// 导入数据库操作模块
const db = require('../db/index')
const formidable = require('formidable');
const path = require('path')
const fs = require('fs')

const http = require('http');
// 上传文件
exports.upload = (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  // 下面的这个意思是放到这个路径下，避免放到根目录
  console.log(req.url)
  req.pipe(fs.createWriteStream('./file' + req.url, {
    //    encoding:'binary' // 行
    //    encoding:'base64' // 行
    encoding: 'utf8' // 不知道为什么，这里怎么设置都不影响，
  }));
  res.end(`${req.url} done!`);

  // //创建formidable表单解析对象
  // const form = new formidable.IncomingForm();
  // //保留上传文件的后缀名字
  // form.keepExtensions = true;
  // //设置上传文件的保存路径
  // form.uploadDir = path.join(__dirname, 'uploads');

  // form.parse(req, (err, fields, files) => {


  // })
}