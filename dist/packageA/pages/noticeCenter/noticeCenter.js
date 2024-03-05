"use strict";require("../../sub-vendors.js");require("../../sub-common/41ff4fbbdedad1c72aa05a42f4a4c5cf.js");require("../../sub-common/32c280022477625f678229039dea4206.js");require("../../sub-common/c2c2b1b332c2656cf7739dff156d5267.js");require("../../sub-common/343a2dde1889905cfe98f71bad0c3d9f.js");require("../../sub-common/dc4daf55b39b9f0ef4148d17ca11fedb.js");/*! For license information please see noticeCenter.js.LICENSE.txt */
(wx.webpackJsonp=wx.webpackJsonp||[]).push([["packageA/pages/noticeCenter/noticeCenter"],{"./src/api-old/index.ts":function(e,t,n){n.d(t,{sysMessageApi:function(){return o}});n("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),n("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");var s=n("./src/utils/http/old_client.ts"),o=function sysMessageApi(){return(0,s.post)({url:"/interface/data.aspx?action=sysmessage"})}},"./src/utils/http/old_client.ts":function(e,t,n){n.d(t,{post:function(){return v}});var s,o=n("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),r=n("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),a=n("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),u=n("./node_modules/@tarojs/taro/index.js"),l=n.n(u),c=n("./src/stores/modules/user.ts"),d=n("./src/constants/index.ts"),i=n("./src/utils/index.ts");var p,m=l().getAccountInfoSync();p=m.miniProgram.appId;var f=function parseUrl(e,t){if(!t)return e;var n=Object.keys(t).map((function(e){return"".concat(e,"=").concat(t[e])}));return e.includes("?")?"".concat(e,"&").concat(n.join("&")):"".concat(e,"?").concat(n.join("&"))},g={"Content-Type":"application/x-www-form-urlencoded"};var _=function createClient(e){function request(e){return _request.apply(this,arguments)}function _request(){return(_request=(0,a.default)((0,o.default)().mark((function _callee5(t){return(0,o.default)().wrap((function _callee5$(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",new Promise((function(n,o){var a=(0,r.default)((0,r.default)({},g),t.headers);if((0,c.useUserStore)().userInfo){var u=(0,c.useUserStore)().userInfo,m=u.openid,_=u.session_key,v=u.unionid;t.data=Object.assign(t.data||{},{openid:m,session_key:_,unionid:v}),t.params&&(t.params=Object.assign(t.params||{},{openid:m,session_key:_,unionid:v}))}t.data=Object.assign(t.data||{}),console.debug("old_client config.data",t.data),console.debug("old_client config.params",t.params);var b=t.url;b.startsWith("http")||(b=t.baseURL?"".concat(t.baseURL).concat(b):"".concat(e.baseURL).concat(b)),b=f(b,t.params),l().request({url:b,timeout:t.timeout||3e4,method:t.method,data:(0,r.default)((0,r.default)({},t.data),{},{appid:p}),header:a,enableHttp2:!0,enableCache:!0,enableQuic:!0,success:function success(e){var t=e.statusCode;if(t===d.RESPONSE_401)return o({code:"401",message:"请重新登录"}),clearTimeout(s),void(s=setTimeout((function(){(0,c.useUserStore)().logout();var e=l().getCurrentInstance().router,t=null==e?void 0:e.params,n=null==e?void 0:e.path;console.debug("relogin Taro.getCurrentInstance().router",l().getCurrentInstance().router),console.debug("relogin pageParams",t),console.debug("relogin pagePath",n);var s=(0,i.routerPathUrl)({path:n,params:t});console.debug("relogin url",s),l().reLaunch({url:s})}),200));var a=e.data.data;if(console.debug("old_client http request res",b,a,e),"string"==typeof a)try{a=JSON.parse(a)}catch(e){console.debug("old_client parse resp error",e)}if(null===a&&(a=(0,r.default)({},e.data)),t<200||t>=300)return Array.isArray(a.message)&&(a.message=a.message.join("\n")),void o(a);n(a)},fail:function fail(e){console.log(e),o(e)}})})));case 1:case"end":return n.stop()}}),_callee5)})))).apply(this,arguments)}var t=function(){var e=(0,a.default)((0,o.default)().mark((function _callee(e){return(0,o.default)().wrap((function _callee$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request((0,r.default)({method:"POST"},e)));case 1:case"end":return t.stop()}}),_callee)})));return function post(t){return e.apply(this,arguments)}}(),n=function(){var e=(0,a.default)((0,o.default)().mark((function _callee2(e){return(0,o.default)().wrap((function _callee2$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request((0,r.default)({method:"PUT"},e)));case 1:case"end":return t.stop()}}),_callee2)})));return function put(t){return e.apply(this,arguments)}}(),u=function(){var e=(0,a.default)((0,o.default)().mark((function _callee3(e){return(0,o.default)().wrap((function _callee3$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request((0,r.default)({method:"GET"},e)));case 1:case"end":return t.stop()}}),_callee3)})));return function get(t){return e.apply(this,arguments)}}(),m=function(){var e=(0,a.default)((0,o.default)().mark((function _callee4(e){return(0,o.default)().wrap((function _callee4$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request((0,r.default)({method:"DELETE"},e)));case 1:case"end":return t.stop()}}),_callee4)})));return function del(t){return e.apply(this,arguments)}}();return{post:t,put:n,get:u,del:m,request:request}}({baseURL:process.env.API_HOST_OLD}),v=_.post;_.put,_.get,_.del},"./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/noticeCenter/noticeCenter.vue":function(e,t,n){var s=n("./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=template&id=0a73c86e&ts=true"),o=n("./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=script&setup=true&lang=ts"),r=n("./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=style&index=0&id=0a73c86e&lang=scss&module=true"),a=n("./node_modules/vue-loader/dist/exportHelper.js");const u={};u.$style=r.default;const l=(0,a.default)(o.default,[["render",s.render],["__cssModules",u],["__file","src/packageA/pages/noticeCenter/noticeCenter.vue"]]);t.default=l},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=script&setup=true&lang=ts":function(e,t,n){var s=n("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),o=n("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),r=n("./node_modules/vue/index.js"),a=n("./src/api-old/index.ts"),u=n("./src/utils/index.ts"),l=n("./node_modules/date-fns/esm/format/index.js"),c=n("./src/components/BackgroundImage/BackgroundImage.vue");t.default=(0,r.defineComponent)({__name:"noticeCenter",setup:function setup(e,t){(0,t.expose)();var n=(0,r.ref)([]);function load(){return _load.apply(this,arguments)}function _load(){return(_load=(0,o.default)((0,s.default)().mark((function _callee(){var e;return(0,s.default)().wrap((function _callee$(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,(0,a.sysMessageApi)();case 3:e=t.sent,n.value=(0,u.regroupNoticeCenterList)(e),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.error("noticeCenter page load err=",t.t0);case 10:case"end":return t.stop()}}),_callee,null,[[0,7]])})))).apply(this,arguments)}(0,r.onMounted)((function(){load()}));var d={noticeList:n,load:load,gotoPage:function gotoPage(e){(0,u.handleLink)(e.type,e.url,e.appid)},get format(){return l.default},BackgroundImage:c.default};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=template&id=0a73c86e&ts=true":function(e,t,n){n.d(t,{render:function(){return render}});var s=n("./src/components/DefaultPage/DefaultPage.vue"),o=n("./src/components/CustomBar/CustomBar.vue"),r=n("./node_modules/vue/index.js"),a=["onTap"];function render(e,t,u,l,c,d){var i=o.default,p=s.default;return(0,r.openBlock)(),(0,r.createBlock)(l.BackgroundImage,null,{default:(0,r.withCtx)((function(){return[(0,r.createVNode)(i,{title:"消息中心"}),l.noticeList.length>0?((0,r.openBlock)(),(0,r.createElementBlock)("view",{key:0,class:(0,r.normalizeClass)([e.$style.main,"iphone-end nut-flex-col nut-col-center nut-row-center"])},[((0,r.openBlock)(!0),(0,r.createElementBlock)(r.Fragment,null,(0,r.renderList)(l.noticeList,(function(t){return(0,r.openBlock)(),(0,r.createElementBlock)("block",{key:t},[(0,r.createElementVNode)("view",{class:(0,r.normalizeClass)(e.$style.main_item)},[(0,r.createElementVNode)("view",{class:(0,r.normalizeClass)(e.$style.time)},(0,r.toDisplayString)(l.format(new Date(t.updatedAt),"yyyy年MM月dd日 HH:mm")),3),(0,r.createElementVNode)("view",{class:(0,r.normalizeClass)([e.$style.list,"border-05px-box-16 nut-flex-1 nut-flex-col nut-row-left nut-col-top"]),onTap:function onTap(e){return l.gotoPage(t)}},[(0,r.createElementVNode)("view",{class:(0,r.normalizeClass)([e.$style.title,"f_s-16"])},(0,r.toDisplayString)(t.title),3),(0,r.createElementVNode)("text",null,(0,r.toDisplayString)(t.content),1)],42,a)],2)])})),128))],2)):((0,r.openBlock)(),(0,r.createElementBlock)("view",{key:1,class:(0,r.normalizeClass)([e.$style.empty_box,"nut-flex nut-flex-1 nut-col-top nut-row-center"])},[(0,r.createVNode)(p,{imgWidth:"48",imgHeight:"48",imgMbottom:"16",tip:"暂无系统消息",icon:n("./src/static/icon/no-msg.png")},null,8,["icon"])],2))]})),_:1})}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=style&index=0&id=0a73c86e&lang=scss&module=true":function(e,t){t.default={main:"noticeCenter__main___rtS2s",main_item:"noticeCenter__main_item___CFJxx",time:"noticeCenter__time___OUo_U",list:"noticeCenter__list___PJFrE",title:"noticeCenter__title___oAPj7",empty_box:"noticeCenter__empty_box___JLpTl","slide-bottom":"noticeCenter__slide-bottom___PsPz7"}},"./src/packageA/pages/noticeCenter/noticeCenter.vue":function(e,t,n){var s=n("./node_modules/@tarojs/runtime/dist/runtime.esm.js"),o=n("./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/noticeCenter/noticeCenter.vue");Page((0,s.createPageConfig)(o.default,"packageA/pages/noticeCenter/noticeCenter",{root:{cn:[]}},{}||{})),o.default},"./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=script&setup=true&lang=ts":function(e,t,n){n.d(t,{default:function(){return s.default}});var s=n("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=template&id=0a73c86e&ts=true":function(e,t,n){n.d(t,{render:function(){return s.render}});var s=n("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=template&id=0a73c86e&ts=true")},"./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=style&index=0&id=0a73c86e&lang=scss&module=true":function(e,t,n){n.d(t,{default:function(){return s.default}});var s=n("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/noticeCenter/noticeCenter.vue?vue&type=style&index=0&id=0a73c86e&lang=scss&module=true")}},function(e){e.O(0,["packageA/sub-vendors","sub-common/41ff4fbbdedad1c72aa05a42f4a4c5cf","sub-common/32c280022477625f678229039dea4206","sub-common/c2c2b1b332c2656cf7739dff156d5267","sub-common/483f6e9b53e3f314843b861c8637927f","sub-common/343a2dde1889905cfe98f71bad0c3d9f","sub-common/dc4daf55b39b9f0ef4148d17ca11fedb","taro","vendors","common"],(function(){return t="./src/packageA/pages/noticeCenter/noticeCenter.vue",e(e.s=t);var t}));e.O()}]);