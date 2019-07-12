/**
 * @file 微信开发库
 */
const config = require('./wechat.cfg');
/**
 * 微信开发库
 * @class Wxchat
 */
class Wxchat{
    constructor(name,age){
        this.name = name;
        this.age=age;
    }
    say(){
        return "我的名字叫" + this.name+"今年"+this.age+"岁了";
    }
}

module.exports = Wxchat;