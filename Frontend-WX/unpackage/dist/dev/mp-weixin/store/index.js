"use strict";
const common_vendor = require("../common/vendor.js");
const api_request = require("../api/request.js");
const selectNavIndex = common_vendor.defineStore("selectNavIndex", {
  state: () => ({
    index: 1
    //0:我的，1：对话；2：ai会话
  })
});
const userData = common_vendor.defineStore("userData", {
  state: () => ({
    isLogin: false,
    //true:已登录，false：未登录
    userInfo: {},
    //用户信息
    chatList: [],
    //聊天列表
    sessionId: "",
    //会话id
    newChat: true
    //true：开启新会话，false：已有对话（或者打开了历史会话）
  }),
  actions: {
    // 未登录获取用户信息
    async isNotLoggedIn(nickName, avatar, code) {
      const result = await api_request.wxLogin({ nickName, avatar, code });
      common_vendor.index.setStorageSync("userInfo", result.data);
      this.userInfo = result.data;
      const chatListData = await api_request.userChatList();
      this.chatList = chatListData.data;
      this.isLogin = true;
    },
    // 获取本地缓存用户信息，判断登录状态
    async isLoggedIn() {
      const userinfo = common_vendor.index.getStorageSync("userInfo");
      this.userInfo = userinfo ? userinfo : {};
      this.isLogin = userinfo ? true : false;
      if (!userinfo)
        return false;
      const chatListData = await api_request.userChatList();
      this.chatList = chatListData.data;
    }
  }
});
const chatbotMessage = common_vendor.defineStore("chatbotMessage", {
  state: () => ({
    //{"role": "user", "content": ""},
    messages: [],
    //存储聊天记录
    receiveText: ""
    //接受大模型返回的文本数据
  }),
  actions: {
    // 接收服务器端大模型返回的数据
    async handleText(objVal) {
      let aiMessages = this.messages[this.messages.length - 1];
      aiMessages.finish_reason = "respond";
      this.receiveText += objVal.choices[0].delta.content || "";
      aiMessages.content = this.receiveText;
      if (objVal.choices[0].finish_reason) {
        aiMessages.finish_reason = objVal.choices[0].finish_reason;
        aiMessages.web_search = objVal.web_search ? objVal.web_search : [];
        const condition = [
          { type: "length", content: "到达token上限,请重新开启新会话" },
          { type: "sensitive", content: "非常抱歉，我目前无法提供你需要的具体信息" },
          { type: "network_error", content: "推理异常，我或许出现了一些问题，你可以重新尝试" }
        ];
        condition.forEach((item) => {
          if (objVal.choices[0].finish_reason === item.type) {
            aiMessages.content = item.content;
          }
        });
        inProgress().value = false;
        const uploadChat = [...this.messages.slice(-2)];
        const result = await api_request.saveChatHistory({
          messages: uploadChat,
          sessionId: userData().sessionId
        });
        console.log(result);
        if (userData().newChat) {
          userData().chatList.unshift(result.data);
          userData().sessionId = result.data.session_id;
          userData().newChat = false;
        }
      }
    },
    // 发送数据到服务器端
    async startSending(content) {
      this.receiveText = "";
      this.messages.push({ "role": "user", content });
      this.messages.push({
        "role": "assistant",
        "content": "",
        "finish_reason": "start",
        "web_search": []
        //搜索网页返回的结果
      });
      inProgress().value = true;
      try {
        await api_request.createCompletions({ messages: this.messages });
      } catch (err) {
        this.messages[this.messages.length - 1].finish_reason = "stop";
        this.messages[this.messages.length - 1].content = "AI回复异常,你可重试";
        console.log(err);
        inProgress().value = false;
      }
    }
  }
});
const chatCreateImages = common_vendor.defineStore("chatCreateImages", {
  state: () => ({
    messages: []
    //url;prompt
  }),
  actions: {
    // 开始发送
    async seartSending(content) {
      console.log(content);
      this.messages = [
        {
          url: "",
          prompt: "AI正在生成中..."
        }
      ];
      inProgress().value = true;
      try {
        const res = await api_request.createImages({ prompt: content });
        let aimessages = this.messages[0];
        if (res.serviceCode === 200) {
          aimessages.url = res.data.url;
        } else {
          aimessages.url = "";
        }
        aimessages.prompt = res.data.prompt || res.msg || "当前生成图片出错,你可重试";
        inProgress().value = false;
      } catch (err) {
        this.messages = [
          {
            url: "",
            prompt: "当前生成图片出错,你可重试"
          }
        ];
        inProgress().value = false;
      }
    }
  }
});
const inProgress = common_vendor.defineStore("inProgress", {
  state: () => ({
    value: false
    //false：表示对话完毕，true：正在进行中
  }),
  actions: {
    queryValue() {
      if (this.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "当前业务正在进行中"
        });
        return true;
      }
    }
  }
});
exports.chatCreateImages = chatCreateImages;
exports.chatbotMessage = chatbotMessage;
exports.inProgress = inProgress;
exports.selectNavIndex = selectNavIndex;
exports.userData = userData;
