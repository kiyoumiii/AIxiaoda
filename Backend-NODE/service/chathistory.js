class ChathistoryService {
  constructor(ctx) {
    this.ctx = ctx;
  }
  // 获取开启新对话需要的数据
  async newChatHistory(openid, sessionId) {
    const messages = await this.ctx.redis.zrange(`chat:${openid}:${sessionId}`, 0, -1);
    const messageContent = messages.map((item) => JSON.parse(item));
    const firstMessage = messageContent[0];
    const time = firstMessage.time;
    const messageObj = {
      content: firstMessage[0].content,
      role: firstMessage[0].role,
    };
    const sessiontData = {
      session_id: sessionId,
      message: [messageObj],
      time,
    };
    return sessiontData;
  }
}

module.exports = ChathistoryService;
