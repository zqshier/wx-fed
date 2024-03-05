/*! For license information please see verify.js.LICENSE.txt */
"use strict";(wx.webpackJsonp=wx.webpackJsonp||[]).push([["pages/verify/verify"],{"./node_modules/@tarojs/taro-loader/lib/raw.js!./src/pages/verify/verify.vue":function(e,s,r){var n=r("./src/pages/verify/verify.vue?vue&type=template&id=027ee90a&ts=true"),u=r("./src/pages/verify/verify.vue?vue&type=script&setup=true&lang=ts"),o=r("./src/pages/verify/verify.vue?vue&type=style&index=0&id=027ee90a&lang=scss&module=true"),t=r("./node_modules/vue-loader/dist/exportHelper.js");const d={};d.$style=o.default;const l=(0,t.default)(u.default,[["render",n.render],["__cssModules",d],["__file","src/pages/verify/verify.vue"]]);s.default=l},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=script&setup=true&lang=ts":function(e,s,r){var n=r("./node_modules/vue/index.js"),u=r("./src/stores/index.ts"),o=r("./src/utils/index.ts"),t=r("./node_modules/@tarojs/taro/index.js"),d=r.n(t);s.default=(0,n.defineComponent)({__name:"verify",setup:function setup(e,s){(0,s.expose)();var r=d().getCurrentInstance().preloadData||{},l=(0,t.useRouter)(),a=l.params.refererName||r.refererName||"微信扫码",i=l.params.prePage||r.prePage||"pages/index/index";function gotoPrePage(){var e="/".concat(i);d().reLaunch({url:e})}(0,n.onMounted)((function(){(0,u.useAppStore)().setShowTabbar(!1),d().scanCode({success:function success(e){console.debug("verify pages res=",JSON.stringify(e));if(null!=e&&e.result&&"https://qr.zippo.com/cw-4JpaBVRHj".includes(e.result))return d().redirectTo({url:"/pages/webview/webview?src=".concat(encodeURIComponent(e.result))});var s="";if(e.path)try{s=((e.path.split("?")||[])[1]||"").split("=")[1]||""}catch(e){s=""}console.debug("verify pages res scene=",s),d().preload({code:s,refererName:a}),d().redirectTo({url:"/pages/verification/verification?scene=".concat(s,"&refererName=").concat(a)})},fail:function fail(e){console.debug("verify pages err=",JSON.stringify(e)),gotoPrePage()},complete:function complete(){(0,u.useAppStore)().setShowTabbar(!0)}})})),(0,n.onUnmounted)((function(){(0,u.useAppStore)().setShowTabbar(!0)}));var c={preloadData:r,router:l,refererName:a,prePage:i,gotoPrePage:gotoPrePage,get cdnurl(){return o.cdnurl}};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=template&id=027ee90a&ts=true":function(e,s,r){r.d(s,{render:function(){return render}});var n=r("./node_modules/vue/index.js"),u=["src"];function render(e,s,r,o,t,d){return(0,n.openBlock)(),(0,n.createElementBlock)("view",{class:(0,n.normalizeClass)(["container nut-flex nut-row-center nut-col-center",e.$style.layout])},[(0,n.createElementVNode)("image",{class:(0,n.normalizeClass)(e.$style.icon_scan),src:o.cdnurl("static/scan.png")},null,10,u)],2)}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=style&index=0&id=027ee90a&lang=scss&module=true":function(e,s){s.default={layout:"verify__layout___FAMaF",icon_scan:"verify__icon_scan___jYY4k","slide-bottom":"verify__slide-bottom___YwAHg"}},"./src/pages/verify/verify.vue":function(e,s,r){var n=r("./node_modules/@tarojs/runtime/dist/runtime.esm.js"),u=r("./node_modules/@tarojs/taro-loader/lib/raw.js!./src/pages/verify/verify.vue");Page((0,n.createPageConfig)(u.default,"pages/verify/verify",{root:{cn:[]}},{usingComponents:{}}||{})),u.default},"./src/pages/verify/verify.vue?vue&type=script&setup=true&lang=ts":function(e,s,r){r.d(s,{default:function(){return n.default}});var n=r("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=script&setup=true&lang=ts")},"./src/pages/verify/verify.vue?vue&type=template&id=027ee90a&ts=true":function(e,s,r){r.d(s,{render:function(){return n.render}});var n=r("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=template&id=027ee90a&ts=true")},"./src/pages/verify/verify.vue?vue&type=style&index=0&id=027ee90a&lang=scss&module=true":function(e,s,r){r.d(s,{default:function(){return n.default}});var n=r("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/pages/verify/verify.vue?vue&type=style&index=0&id=027ee90a&lang=scss&module=true")}},function(e){e.O(0,["taro","vendors","common"],(function(){return s="./src/pages/verify/verify.vue",e(e.s=s);var s}));e.O()}]);