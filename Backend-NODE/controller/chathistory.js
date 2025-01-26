const validate = require("@/validate/index");
const dayjs = require("dayjs");
const crypto = require("crypto");
const ChathistoryService = require("@/service/chathistory");
class ChathistoryController {
  // 存储聊天记录
  async saveChatHistory(ctx) {
    const { messages, sessionId } = ctx.request.body;
    await validate.isarrayCheck(messages, "请上传聊天记录", "messages");
    // 存储会话id
    let session_id = "";
    if (sessionId) {
      session_id = sessionId;
    } else {
      const year = dayjs().format("YYYYMMDD");
      const time = dayjs().format("HHmmssSSS");
      session_id = year + time;
    }
    // 用户openid
    const openid = ctx.auth.uid;
    // 会话时间
    const time = dayjs().format("YYYY-MM-DD");
    // 时间戳
    const timeStamp = dayjs().valueOf();
    const key = `chat:${openid}`;
    // 生成唯一消息id
    const messageId = crypto.randomUUID();
    const messageContent = JSON.stringify({ time, messageId, ...messages });
    // 存储用户的会话id
    ctx.redis.zadd(key, timeStamp, session_id);
    // 存储聊天记录
    const sessionKey = `chat:${openid}:${session_id}`;
    ctx.redis.zadd(sessionKey, timeStamp, messageContent);
    /* 
    如果前端上传了会话id，不再返回任何数据，否则的话，说明开启了新会话，那要把
    会话id和时间和第一段用户发的对话返回
    */
    if (sessionId) {
      ctx.send();
    } else {
      const result = await new ChathistoryService(ctx).newChatHistory(openid, session_id);
      ctx.send(result);
    }
  }
  // 获取用户的全部聊天记录列表
  async fetchChatHistory(ctx) {
    // 用户openid
    const openid = ctx.auth.uid;
    const key = `chat:${openid}`;
    const sessionIds = await ctx.redis.zrevrange(key, 0, -1);
    let chatHistory = [];
    for (const itemids of sessionIds) {
      const messages = await ctx.redis.zrange(`chat:${openid}:${itemids}`, 0, -1);
      const messageContent = messages.map((item) => JSON.parse(item));
      const firstMessage = messageContent[0];
      const time = firstMessage.time;
      const messageObj = {
        content: firstMessage[0].content,
        role: firstMessage[0].role,
      };
      const sessiontData = {
        session_id: itemids,
        message: [messageObj],
        time,
      };
      chatHistory.push(sessiontData);
    }
    ctx.send(chatHistory);
  }
  // 点击聊天列表获取对应的聊天内容
  async onliChatHistory(ctx) {
    const { sessionId } = ctx.query;
    await validate.nullCheck(sessionId, "缺少会话id值", "sessionId");
    // 用户openid
    const openid = ctx.auth.uid;
    const key = `chat:${openid}:${sessionId}`;
    const messages = await ctx.redis.zrange(key, 0, -1);
    const messageContent = messages.map((item) => JSON.parse(item));
    const chatData = [];
    messageContent.forEach((item) => {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        if (key !== "time" && key !== "messageId") {
          chatData.push(item[key]);
        }
      });
    });
    ctx.send(chatData);
  }
}

module.exports = new ChathistoryController();
