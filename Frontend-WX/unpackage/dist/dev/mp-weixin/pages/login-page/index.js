"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.reactive({
      avatar: "",
      nickname: ""
    });
    const chooseavatar = (event) => {
      userInfo.avatar = event.detail.avatarUrl;
    };
    const loading = common_vendor.ref(false);
    const fromSubmit = async (event) => {
      userInfo.nickname = event.detail.value.input;
      if (userInfo.avatar === "" || userInfo.nickname.trim() === "") {
        common_vendor.index.showToast({
          icon: "none",
          title: "请填写头像和昵称"
        });
        return false;
      }
      loading.value = true;
      const uploadAvatar = await common_vendor.index.uploadFile({
        url: api_request.uploadUrl,
        filePath: userInfo.avatar,
        name: "file"
      });
      const fileurl = JSON.parse(uploadAvatar.data).data.fileurl;
      common_vendor.index.login({
        success: async (res) => {
          await store_index.userData().isNotLoggedIn(
            userInfo.nickname,
            fileurl,
            res.code
          );
          loading.value = false;
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$2,
        b: userInfo.avatar === "" ? "/static/touxiang.png" : userInfo.avatar,
        c: common_vendor.o(chooseavatar),
        d: loading.value,
        e: common_vendor.o(fromSubmit)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3300ff66"]]);
wx.createComponent(Component);
