const Router = require("@koa/router");
const router = new Router();
// 用户相关的
const user = require("@/controller/user");
// 大模型
const zhipu = require("@/controller/zhipuai");
// 获取阿里云token
const voice = require("@/controller/voice");
// 对话
const saveChatHistory = require("@/controller/chathistory");
// 权限处理
const authority = require("@/config/auth");
// 登录接口
router.post("/wxlogin", user.wxLogin);
// 文生文
router.post("/create-completions", authority, zhipu.createCompletions);
// 文生图
router.post("/create-images", authority, zhipu.createImages);
//获取阿里云token
router.get("/alitoken", voice.aliToken);
// 存储聊天记录
router.post("/save-chat-history", authority, saveChatHistory.saveChatHistory);
//获取用户的全部聊天记录列表
router.get("/fetch-chat-history", authority, saveChatHistory.fetchChatHistory);
//点击聊天列表获取对应的聊天内容
router.get("/only-chat-history", authority, saveChatHistory.onliChatHistory);
module.exports = router;
