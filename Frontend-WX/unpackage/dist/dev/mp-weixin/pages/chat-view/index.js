"use strict";
const common_vendor = require("../../common/vendor.js");
const api_componentApi = require("../../api/component-api.js");
const store_index = require("../../store/index.js");
if (!Math) {
  (startPageVue + chatAreaVue + aiDrawingVue + inputBoxVue + personalCenter + loginPage)();
}
const startPageVue = () => "./component/start-page.js";
const chatAreaVue = () => "./component/chat-area.js";
const aiDrawingVue = () => "./component/ai-drawing.js";
const inputBoxVue = () => "./component/input-box.js";
const personalCenter = () => "../personal-center/index.js";
const loginPage = () => "../login-page/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "152d0a4f": common_vendor.unref(but_button),
      "8ad40950": common_vendor.unref(but_top),
      "1e837444": common_vendor.unref(but_height)
    }));
    const { but_height, but_top, but_button } = api_componentApi.buttonPosition();
    const menu = common_vendor.ref(["我的", "对话", "AI绘画"]);
    const selectNavIndexFun = store_index.selectNavIndex();
    const chatbotMessageFun = store_index.chatbotMessage();
    const selectNav = (index) => {
      if (store_index.inProgress().queryValue())
        return false;
      selectNavIndexFun.$patch((state) => {
        state.index = index;
      });
    };
    common_vendor.watch(() => chatbotMessageFun.messages, (newval) => {
      setTimeout(() => {
        const query = common_vendor.index.createSelectorQuery();
        query.select(".chatAreaVue").boundingClientRect();
        query.exec((rect) => {
          common_vendor.index.pageScrollTo({
            scrollTop: rect[0].height + 200
          });
        });
      }, 500);
    }, { deep: true });
    common_vendor.onLoad(() => {
      store_index.userData().isLoggedIn();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(menu.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.unref(selectNavIndexFun).index === index ? 1 : "",
            d: common_vendor.o(($event) => selectNav(index), index)
          };
        }),
        b: common_vendor.s(_ctx.__cssVars()),
        c: common_vendor.s(_ctx.__cssVars()),
        d: common_vendor.unref(selectNavIndexFun).index === 1 && common_vendor.unref(chatbotMessageFun).messages.length <= 0,
        e: common_vendor.s(_ctx.__cssVars()),
        f: common_vendor.unref(selectNavIndexFun).index === 1 && common_vendor.unref(chatbotMessageFun).messages.length > 0,
        g: common_vendor.s(_ctx.__cssVars()),
        h: common_vendor.unref(selectNavIndexFun).index === 2,
        i: common_vendor.s(_ctx.__cssVars()),
        j: common_vendor.unref(selectNavIndexFun).index === 1,
        k: common_vendor.s(_ctx.__cssVars()),
        l: common_vendor.unref(selectNavIndexFun).index === 0,
        m: common_vendor.s(_ctx.__cssVars()),
        n: !common_vendor.unref(store_index.userData)().isLogin
      }, !common_vendor.unref(store_index.userData)().isLogin ? {
        o: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        p: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
wx.createPage(_sfc_main);
