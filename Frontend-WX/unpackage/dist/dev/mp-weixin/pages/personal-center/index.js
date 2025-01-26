"use strict";
const common_vendor = require("../../common/vendor.js");
const api_componentApi = require("../../api/component-api.js");
const store_index = require("../../store/index.js");
const api_request = require("../../api/request.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "20744032": common_vendor.unref(but_button)
    }));
    const { but_height, but_top, but_button } = api_componentApi.buttonPosition();
    const userDataStore = store_index.userData();
    const chatbotMessageStore = store_index.chatbotMessage();
    const selectNavIndexStore = store_index.selectNavIndex();
    const openChat = () => {
      userDataStore.newChat = true;
      userDataStore.sessionId = "";
      chatbotMessageStore.messages = [];
      selectNavIndexStore.index = 1;
    };
    const selectChatHistory = async (sessionId) => {
      userDataStore.newChat = false;
      userDataStore.sessionId = sessionId;
      selectNavIndexStore.index = 1;
      common_vendor.index.showLoading({
        mask: true,
        title: "请求中"
      });
      const result = await api_request.onlyChatHistory({ sessionId });
      chatbotMessageStore.messages = result.data;
      common_vendor.index.hideLoading();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s(_ctx.__cssVars()),
        b: common_vendor.unref(userDataStore).userInfo.avatar,
        c: common_vendor.t(common_vendor.unref(userDataStore).userInfo.nickName),
        d: common_vendor.o(openChat),
        e: common_vendor.unref(userDataStore).chatList.length > 0
      }, common_vendor.unref(userDataStore).chatList.length > 0 ? {} : {}, {
        f: common_vendor.unref(userDataStore).chatList.length > 0
      }, common_vendor.unref(userDataStore).chatList.length > 0 ? {
        g: common_vendor.f(common_vendor.unref(userDataStore).chatList, (item, index, i0) => {
          return {
            a: common_vendor.f(item.message, (itema, indexa, i1) => {
              return {
                a: common_vendor.t(itema.content),
                b: indexa
              };
            }),
            b: common_vendor.t(item.time),
            c: index,
            d: common_vendor.o(($event) => selectChatHistory(item.session_id), index)
          };
        })
      } : {}, {
        h: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b2db1d6a"]]);
wx.createComponent(Component);
