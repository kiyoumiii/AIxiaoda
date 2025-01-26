"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_index = require("../../../store/index.js");
if (!Array) {
  const _component_towxml = common_vendor.resolveComponent("towxml");
  _component_towxml();
}
if (!Math) {
  loadingVue();
}
const loadingVue = () => "./loading.js";
const _sfc_main = {
  __name: "chat-area",
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    const appContext = common_vendor.ref(null);
    appContext.value = instance.appContext.config.globalProperties;
    const copyText = (url) => {
      common_vendor.index.setClipboardData({
        data: url,
        success() {
          common_vendor.index.showToast({
            icon: "none",
            title: "链接已复制,请到浏览器打开"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(store_index.chatbotMessage)().messages, (item, index, i0) => {
          return common_vendor.e({
            a: item.role === "user"
          }, item.role === "user" ? {
            b: common_vendor.t(item.content)
          } : {}, {
            c: item.role === "assistant"
          }, item.role === "assistant" ? common_vendor.e({
            d: "235f4245-0-" + i0,
            e: common_vendor.p({
              nodes: appContext.value.$towxml(item.content, "markdown")
            }),
            f: item.finish_reason == "start"
          }, item.finish_reason == "start" ? {
            g: "235f4245-1-" + i0
          } : {}, {
            h: item.web_search.length > 0
          }, item.web_search.length > 0 ? {
            i: common_vendor.f(item.web_search, (itema, indexa, i1) => {
              return {
                a: common_vendor.t(indexa + 1),
                b: common_vendor.t(itema.title),
                c: common_vendor.t(itema.media),
                d: indexa,
                e: common_vendor.o(($event) => copyText(itema.link), indexa)
              };
            })
          } : {}) : {}, {
            j: index
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-235f4245"]]);
wx.createComponent(Component);
