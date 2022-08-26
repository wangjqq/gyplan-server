const fs = require('fs')
const pathLib = require('path')


// 上传文件
exports.upload = (req, res) => {
  // var newName = req.files[0].path + pathLib.parse(req.files[0].originalname).ext
  // var newName =req.files[0].path.
  var newName = pathLib.join('./upload' + req.body.src + '/' + req.files[0].originalname);
  // console.log(req.files[0].path);
  console.log(req);
  // console.log(pathLib.parse(req.files[0].originalname).ext);
  console.log(newName);
  // console.log(req.files[0].originalname);
  // 利用fs模块的文件重命名
  // req.files[0].path这个是文件的在传递中被修改的名字，newName是文件原名称,function回调函数
  fs.rename(req.files[0].path, newName, function (err) {
    if (err) {
      res.send('失败')
    } else {
      res.send('成功')
    }
  })
}