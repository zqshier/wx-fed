"use strict";require("../../../sub-vendors.js");/*! For license information please see eventList.js.LICENSE.txt */
(wx.webpackJsonp=wx.webpackJsonp||[]).push([["packageA/pages/events/eventList/eventList"],{"./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/events/eventList/eventList.vue":function(e,t,s){var n=s("./src/packageA/pages/events/eventList/eventList.vue?vue&type=template&id=3c17b0e1&ts=true"),a=s("./src/packageA/pages/events/eventList/eventList.vue?vue&type=script&setup=true&lang=ts"),o=s("./src/packageA/pages/events/eventList/eventList.vue?vue&type=style&index=0&id=3c17b0e1&lang=scss&module=true"),u=s("./node_modules/vue-loader/dist/exportHelper.js");const l={};l.$style=o.default;const d=(0,u.default)(a.default,[["render",n.render],["__cssModules",l],["__file","src/packageA/pages/events/eventList/eventList.vue"]]);t.default=d},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=script&setup=true&lang=ts":function(e,t,s){var n=s("./node_modules/vue/index.js"),a=s("./src/utils/index.ts"),o=s("./src/utils/track/index.ts"),u=s("./src/utils/track/config.ts"),l=s("./node_modules/@tarojs/taro/index.js"),d=s.n(l);t.default=(0,n.defineComponent)({__name:"EventItem",props:{data:{type:Object,default:[]}},setup:function setup(e,t){(0,t.expose)();var r=e;(0,n.useCssVars)((function(e){return{"162ceb99-bgImg":p}}));var i=(0,l.getApp)()["".concat("zippo")],c=(0,u.getRefererPath)(),p="url(".concat((0,a.cdnurl)("static/vector.png"),")"),v=(0,n.computed)((function(){var e,t={text:"",icon:""};switch(null===(e=r.data)||void 0===e?void 0:e.state){case 0:t.text="未开始",t.icon=s("./src/packageA/image/progress.png");break;case 1:t.text="进行中",t.icon=s("./src/packageA/image/wait.png");break;case 2:t.text="已结束",t.icon=s("./src/packageA/image/end.png")}return t}));var m={linkflow:i,triggerPagePath:c,bgImg:p,props:r,status:v,goDetail:function goDetail(){var e,t,s;i&&i.track({event:o.ELinkflowEventsName.Campaign_Click,props:{campaignName:null===(e=r.data)||void 0===e?void 0:e.title,campaignId:null===(t=r.data)||void 0===t?void 0:t.id,campaignStatus:v.value.text,triggerPagePath:c}}),d().navigateTo({url:"/packageA/pages/events/eventDetails/eventDetails?id=".concat(null===(s=r.data)||void 0===s?void 0:s.id)})}};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=script&setup=true&lang=ts":function(e,t,s){var n=s("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),a=s("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),o=s("./node_modules/vue/index.js"),u=s("./node_modules/@tarojs/taro/index.js"),l=s("./src/components/CustomBar/CustomBar.vue"),d=s("./src/components/BackgroundImage/BackgroundImage.vue"),r=s("./src/components/CustomBar/props.ts"),i=s("./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue"),c=s("./src/api/activity.ts"),p=s("./src/utils/index.ts");t.default=(0,o.defineComponent)({__name:"eventList",setup:function setup(e,t){(0,t.expose)();var s=(0,o.reactive)({page:1,perPage:20}),v=(0,o.ref)(!1),m=(0,o.ref)(!1),g=(0,o.ref)(),A=function(){var e=(0,a.default)((0,n.default)().mark((function _callee(){var e,t,a;return(0,n.default)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:if(!v.value){n.next=2;break}return n.abrupt("return");case 2:return n.prev=2,n.next=5,(0,c.getActList)(s);case 5:e=n.sent,(t=e.list).length<s.perPage&&(v.value=!0),1===s.page?g.value=t:g.value=null===(a=g.value)||void 0===a?void 0:a.concat(t),s.page+=1,m.value=!0,n.next=17;break;case 13:n.prev=13,n.t0=n.catch(2),(0,p.Toast)(n.t0.message),console.error("loadList error=",n.t0);case 17:case"end":return n.stop()}}),_callee,null,[[2,13]])})));return function loadList(){return e.apply(this,arguments)}}();(0,u.useReachBottom)((function(){A()}));var _=function initPageData(){v.value=!1,s.page=1},f=function(){var e=(0,a.default)((0,n.default)().mark((function _callee2(){return(0,n.default)().wrap((function _callee2$(e){for(;;)switch(e.prev=e.next){case 0:return _(),e.next=3,A();case 3:case"end":return e.stop()}}),_callee2)})));return function init(){return e.apply(this,arguments)}}();(0,u.useDidShow)((0,a.default)((0,n.default)().mark((function _callee3(){return(0,n.default)().wrap((function _callee3$(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f();case 2:case"end":return e.stop()}}),_callee3)}))));var j={listParams:s,finished:v,isLoaded:m,activityList:g,loadList:A,initPageData:_,init:f,CustomBar:l.default,BackgroundImage:d.default,get LogoColorType(){return r.LogoColorType},EventItem:i.default};return Object.defineProperty(j,"__isScriptSetup",{enumerable:!1,value:!0}),j}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=template&id=162ceb99&ts=true":function(e,t,s){s.d(t,{render:function(){return render}});var n=s("./node_modules/vue/index.js"),a=["src"],o=["src"];function render(e,t,s,u,l,d){var r,i;return(0,n.openBlock)(),(0,n.createElementBlock)("view",{class:(0,n.normalizeClass)([e.$style.item,"mg-bottom-16"]),onTap:u.goDetail},[(0,n.createElementVNode)("view",{class:(0,n.normalizeClass)([e.$style.item_status,"nut-flex-col nut-col-center f_s-12 f_w-600"])},[(0,n.createElementVNode)("image",{class:(0,n.normalizeClass)(e.$style.status_icon),src:u.status.icon,mode:"aspectFit"},null,10,a),(0,n.createElementVNode)("text",null,(0,n.toDisplayString)(u.status.text),1)],2),(0,n.createElementVNode)("image",{class:(0,n.normalizeClass)(e.$style.item_img),src:null===(r=s.data)||void 0===r?void 0:r.image,mode:"aspectFit"},null,10,o),(0,n.createElementVNode)("view",{class:(0,n.normalizeClass)([e.$style.item_title,"f_s-12 f_w-400"])},(0,n.toDisplayString)(null===(i=s.data)||void 0===i?void 0:i.title),3)],34)}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=template&id=3c17b0e1&ts=true":function(e,t,s){s.d(t,{render:function(){return render}});var n=s("./src/components/Loading/Loading.vue"),a=s("./node_modules/vue/index.js");function render(e,t,s,o,u,l){var d=n.default;return(0,a.openBlock)(),(0,a.createBlock)(o.BackgroundImage,{class:(0,a.normalizeClass)(e.$style.container)},{default:(0,a.withCtx)((function(){return[(0,a.createVNode)(o.CustomBar,{title:"","logo-color":o.LogoColorType.BLACK},null,8,["logo-color"]),o.isLoaded?((0,a.openBlock)(),(0,a.createElementBlock)("view",{key:0,class:(0,a.normalizeClass)(e.$style.main)},[((0,a.openBlock)(!0),(0,a.createElementBlock)(a.Fragment,null,(0,a.renderList)(o.activityList,(function(e){return(0,a.openBlock)(),(0,a.createBlock)(o.EventItem,{key:e.id,data:e},null,8,["data"])})),128))],2)):(0,a.createCommentVNode)("v-if",!0),(0,a.createVNode)(d,{show:!o.isLoaded},null,8,["show"])]})),_:1},8,["class"])}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=style&index=0&id=162ceb99&lang=scss&module=true":function(e,t){t.default={item:"EventItem__item___Defd4",item_status:"EventItem__item_status___MfAhu",status_icon:"EventItem__status_icon___VUcNN",item_img:"EventItem__item_img___rl9b8",item_title:"EventItem__item_title___DfmiF","slide-bottom":"EventItem__slide-bottom___qgeNi"}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=style&index=0&id=3c17b0e1&lang=scss&module=true":function(e,t){t.default={container:"eventList__container____Woh0",main:"eventList__main___yyBIZ","slide-bottom":"eventList__slide-bottom___WQOq3"}},"./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue":function(e,t,s){var n=s("./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=template&id=162ceb99&ts=true"),a=s("./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=script&setup=true&lang=ts"),o=s("./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=style&index=0&id=162ceb99&lang=scss&module=true"),u=s("./node_modules/vue-loader/dist/exportHelper.js");const l={};l.$style=o.default;const d=(0,u.default)(a.default,[["render",n.render],["__cssModules",l],["__file","src/packageA/pages/events/eventList/components/EventItem/EventItem.vue"]]);t.default=d},"./src/packageA/pages/events/eventList/eventList.vue":function(e,t,s){var n=s("./node_modules/@tarojs/runtime/dist/runtime.esm.js"),a=s("./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/events/eventList/eventList.vue");Page((0,n.createPageConfig)(a.default,"packageA/pages/events/eventList/eventList",{root:{cn:[]}},{}||{})),a.default},"./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=script&setup=true&lang=ts":function(e,t,s){s.d(t,{default:function(){return n.default}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/events/eventList/eventList.vue?vue&type=script&setup=true&lang=ts":function(e,t,s){s.d(t,{default:function(){return n.default}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=template&id=162ceb99&ts=true":function(e,t,s){s.d(t,{render:function(){return n.render}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=template&id=162ceb99&ts=true")},"./src/packageA/pages/events/eventList/eventList.vue?vue&type=template&id=3c17b0e1&ts=true":function(e,t,s){s.d(t,{render:function(){return n.render}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=template&id=3c17b0e1&ts=true")},"./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=style&index=0&id=162ceb99&lang=scss&module=true":function(e,t,s){s.d(t,{default:function(){return n.default}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/components/EventItem/EventItem.vue?vue&type=style&index=0&id=162ceb99&lang=scss&module=true")},"./src/packageA/pages/events/eventList/eventList.vue?vue&type=style&index=0&id=3c17b0e1&lang=scss&module=true":function(e,t,s){s.d(t,{default:function(){return n.default}});var n=s("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/events/eventList/eventList.vue?vue&type=style&index=0&id=3c17b0e1&lang=scss&module=true")},"./src/packageA/image/end.png":function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGqSURBVHgB7ZjtccIwDIZFj/9lBLoBI7BB2aBhAugEhAkoE0A3aCdougGdoBmhG9BXjd3LOV+KL+CE03Ons6PIjhXLUi5EiqLUcjZI9dee/44GjjoQmpHtdBHP12QEuB38DoxdhfXMYndGqm9L2/ndSNFDHJqxwCalIdBVZb007jr1DISmcAaGVtBuv5D1DS1kfUMdCI06EBrJx9wfyF4zNLuK25/IvjFsntCPICmul7mxczQbyBH614q5UsgW91PyoeljjhdxruZgbOKcbpEbGxldLJhrTS3W6RNCyajIssTugOdMGuY6msL5AHk2uh3GTUnIpc7ACcKL30iMOWwgL+hujSoiIeIzkGNmQya3AHcH9pAVZA3bd5Jzss+QDvBxgN9s5OjKQohD4oOyw7onGT+mvRfa+50BymI2LwWwK2zHC+e3uSIZ9s1/Ce29doBapLoYwqm1MSRMqrWOvpEQnx3gFPjtyKHMEI5ySGxr5lrYOSgLtylltSAhIV47YB5Ud/0PZxcs8BHdecntiREmIVPoyAe3QPSVLgpZr1AHQqMOhEZ/bCmKEpZfq3UsuOWZ83IAAAAASUVORK5CYII="},"./src/packageA/image/progress.png":function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGfSURBVHgB7ZiLccIwDIZNjwEyAt2AbkA36AZ0EzICG4QNGCFsQDdINkg2SOU76VAdJ5WNi0lP350Ox/5jS34TYxRFmWVApPmPrv/FLBwNIDcrSqSYz49kBdjfxY/A2s2gyAgaGWl+KKH1uzNFF3Fu1gJNa5ZAqpP1r3H91DWQm9EaWNqB9v8PsmdDD7JnQwPIjQaQm7sDgF1tB1aDdXhNuYJVYBuBbm9SEXOZA/lhuHFlDnY8gAkdUZkAJv0MDQCkn/hKY3vXKdvyNOo6rrMB4ruW0ghJGQA1/vGL7oy6vadsR8EZebs//Bx9lZBcJXB6NFyPvb5lshaKLuhcAfYGz1+euqj8FcpbIwiAtyv5RzZHz9J2JA7s+YLm0yYjahfCnrIOFWxen8De0TjU66OphiNpe7+X9P4sEWugZLtK4amrxjRf7BtHdw7diVIu4gKdJ+cqsONw2yJrpj15dA3LKwLaTRMAC8I6Q4fTgOnKMyolc5p0xxDnfX5G7UITFdMOZHef/l7dzPt+P2NGIAeun3qZy40GkBv9sKUoSl6+AVyEZwfmU9hGAAAAAElFTkSuQmCC"},"./src/packageA/image/wait.png":function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHMSURBVHgB7ZiLUcMwDEBVrgNkBG9QmIAwAWyQbEBH6AawAWECukHLBM0GsAEwgZGxfbiu4x9JnFC/O11TKXakWpbcAGQyGStU4Ksfe/4LmDk5gNQs5EUf+TwmC4R9zn4FlrpCRiaRK+OrDyV0fj1T8iZOzdLjnneYA3111qHR/cx7IDUne2BuDe3/N7KpkRvZ1Bg1AFz9N5QSemS0AITjBUoJQxDbiXHIhv6ysdzXoNyzVQAPP7p80W0+Z6EoDKlyjbJGuUJbDcdnrBaL3ydEcPKPrI8yilOxVDkAT5ktyhf7jlM/o43gdS1sK+ApdYO2vefcZj9jU8jyIIKyQ3nosFcoB5RLCKDTz74DUOZle2Sn6WoRXAGBpDiN7oGnECgOs3x/jc17Fe8AxC8mhSj6StFXhqF3KC+sAuEnS5kn4Bt45XoOhOBKIXoMUfTWMkp582LyyFYAZS1y/8OUQupDgvz0CKCUoumJYiOarRDOmsawoG59n+P00xXAVKAJNvGgnMVrlR8ob/+SrSyBlDci2YzYkaA1jUF9o+iDx/g46NrEwVWoq6LEjOnyM+Qw1yjXagNqFVtrGQN/HGPHtQJTIVehqZFfbGUymbR8AxnbYFla/TlGAAAAAElFTkSuQmCC"}},function(e){e.O(0,["packageA/sub-vendors","taro","vendors","common"],(function(){return t="./src/packageA/pages/events/eventList/eventList.vue",e(e.s=t);var t}));e.O()}]);