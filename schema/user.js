// 导入验证规则的包
const joi = require('joi')

// 导入用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,20}$/).required()
const captcha = joi.string().pattern(/^[\S]{4}$/).required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
        captcha
    }
}