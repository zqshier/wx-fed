/*! For license information please see e2e75a4230d4a794031faeae92e4c1ec.js.LICENSE.txt */
"use strict";(wx.webpackJsonp=wx.webpackJsonp||[]).push([["sub-common/e2e75a4230d4a794031faeae92e4c1ec"],{"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Document/Document.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){var o=t("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),u=t("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),a=t("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),s=t("./node_modules/vue/index.js"),l=t("./src/stores/index.ts"),r=t("./src/utils/index.ts"),i=t("./node_modules/@tarojs/taro/index.js"),d=t.n(i);n.default=(0,s.defineComponent)({__name:"Document",props:["code","maxWidth","imageStyle","imageBoxStyle","imageHeight","dcontents","format","className","imageMode","textStyle"],emits:["clickCallback"],setup:function setup(e,n){var t=n.expose,i=n.emit;t();var c=e,m=(0,l.useDocumentStore)(),p=(0,s.ref)([]),f=(0,s.ref)(new Map),v=(0,s.ref)(!0),g=(0,s.ref)(!1),h=(0,s.ref)(""),x=(0,s.computed)((function(){return c.code})),b=(0,s.computed)((function(){return c.imageStyle&&(0,a.default)({},c.imageStyle)||{}}));(0,s.watch)((function(){return c.dcontents}),(function(e){e&&(p.value=e)})),(0,s.onMounted)((function(){d().nextTick((0,u.default)((0,o.default)().mark((function _callee(){var e;return(0,o.default)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:if(!x.value){n.next=6;break}return n.next=3,m.load(x.value);case 3:e=n.sent,p.value=(null==e?void 0:e.contents)||[],h.value=(null==e?void 0:e.title)||"";case 6:c.dcontents&&(p.value=c.dcontents||[]);case 7:case"end":return n.stop()}}),_callee)}))))}));var S={documentStore:m,props:c,emit:i,contents:p,imageSizes:f,isPause:v,videoFullScreenKey:g,title:h,code:x,imageStyle:b,onImageLoad:function onImageLoad(e){var n=e.detail,t=n.width,o=n.height,u=c.maxWidth?c.maxWidth:375,a=u/t;f.value.set(e.currentTarget.dataset.id,{width:d().pxTransform(u),height:d().pxTransform(o*a)})},onVideoLoad:function onVideoLoad(e){console.debug(e);var n=e.detail,t=n.width,o=n.height,u=c.maxWidth?c.maxWidth:375,a=u/t;f.value.set(e.mpEvent.currentTarget.id,{width:d().pxTransform(u),height:d().pxTransform(o*a)})},playVideo:function playVideo(e){var n=d().createVideoContext(e);v.value?n.play():n.pause(),v.value=!v.value},onFullscreenchange:function onFullscreenchange(e){var n=e.detail.fullScreen;console.debug("fullScreen",n),g.value=n},gotoPage:function gotoPage(e){e.link&&(i("clickCallback",e),(0,r.handleLink)(e.linkType,e.link))},get imageProcess(){return r.imageProcess}};return Object.defineProperty(S,"__isScriptSetup",{enumerable:!1,value:!0}),S}})},"./src/components/Document/Document.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){t.d(n,{default:function(){return o.default}});var o=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Document/Document.vue?vue&type=script&setup=true&lang=ts")}}]);