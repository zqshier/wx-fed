/*! For license information please see f61d1e9aff3a21031f01ffaafda349a1.js.LICENSE.txt */
"use strict";(wx.webpackJsonp=wx.webpackJsonp||[]).push([["sub-common/f61d1e9aff3a21031f01ffaafda349a1"],{"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Document/Document.vue?vue&type=template&id=0fbf17a2&ts=true":function(e,t,n){n.d(t,{render:function(){return render}});var o=n("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),l=n("./node_modules/vue/index.js"),s=["onTap"],a=["data-id","src","mode"],r=["onTap"],c=["onTap"],i={class:"nut-flex nut-flex-col nut-row-center"},u=["src"],d=(0,l.createElementVNode)("text",{class:"f_s-12"},"点击播放视频",-1),m=["show-progress","show-play-btn","show-center-play-btn","src","id","title"],p={userSelect:!0};function render(e,t,f,y,g,v){return(0,l.openBlock)(),(0,l.createElementBlock)("view",{class:(0,l.normalizeClass)([e.$style.layout,"nut-flex nut-flex-col nut-col-top nut-row-left"])},[((0,l.openBlock)(!0),(0,l.createElementBlock)(l.Fragment,null,(0,l.renderList)(y.contents,(function(g,v){return(0,l.openBlock)(),(0,l.createElementBlock)("block",{key:v},[(0,l.createElementVNode)("view",{class:(0,l.normalizeClass)([e.$style.item,f.className]),style:(0,l.normalizeStyle)(y.imageStyle)},["image"===g.type?((0,l.openBlock)(),(0,l.createElementBlock)("view",{key:0,class:(0,l.normalizeClass)(e.$style.item_img),style:(0,l.normalizeStyle)([y.imageSizes.get(y.imageProcess(g.content,"L",f.format)),(0,o.default)({},f.imageHeight)]),onTap:(0,l.withModifiers)((function(e){return y.gotoPage(g.meta)}),["stop"])},[(0,l.createElementVNode)("image",{class:(0,l.normalizeClass)(e.$style.image),"data-id":y.imageProcess(g.content,"L",f.format),src:y.imageProcess(g.content,"L",f.format),"lazy-load":!0,mode:f.imageMode,"show-menu-by-longpress":!0,onLoad:y.onImageLoad},null,42,a)],46,s)):(0,l.createCommentVNode)("v-if",!0),"video"===g.type?((0,l.openBlock)(),(0,l.createElementBlock)("view",{key:1,class:(0,l.normalizeClass)(e.$style.item_img),style:(0,l.normalizeStyle)(y.imageSizes.get("video-".concat(g.content))),onTap:(0,l.withModifiers)((function(e){return y.gotoPage(g.meta)}),["stop"])},[(0,l.createElementVNode)("view",{class:(0,l.normalizeClass)([e.$style.pause_box,"nut-flex nut-flex-col nut-row-center"]),onTap:(0,l.withModifiers)((function(e){return y.playVideo("video-".concat(g.content))}),["stop"])},[(0,l.withDirectives)((0,l.createElementVNode)("view",i,[(0,l.createElementVNode)("image",{class:(0,l.normalizeClass)(e.$style.play_image),src:n("./src/static/icon/play.png")},null,10,u),d],512),[[l.vShow,y.isPause]])],42,c),(0,l.createElementVNode)("video",{"show-progress":y.videoFullScreenKey,"show-play-btn":y.videoFullScreenKey,"show-center-play-btn":y.videoFullScreenKey,direction:90,src:g.content,id:"video-".concat(g.content),title:y.title,style:{width:"100%",height:"100%"},onLoadedmetadata:y.onVideoLoad,onPlay:t[0]||(t[0]=function(e){return y.isPause=!1}),onPause:t[1]||(t[1]=function(e){return y.isPause=!0}),onEnded:t[2]||(t[2]=function(e){return y.isPause=!0}),onFullscreenchange:y.onFullscreenchange},null,40,m)],46,r)):(0,l.createCommentVNode)("v-if",!0),"text"===g.type?((0,l.openBlock)(!0),(0,l.createElementBlock)(l.Fragment,{key:2},(0,l.renderList)(g.content.split("\n"),(function(t){return(0,l.openBlock)(),(0,l.createElementBlock)("block",{key:t},[(0,l.createElementVNode)("view",{class:(0,l.normalizeClass)(e.$style.item_text),style:(0,l.normalizeStyle)(f.textStyle)},[(0,l.createElementVNode)("text",p,(0,l.toDisplayString)(t),1)],6)])})),128)):(0,l.createCommentVNode)("v-if",!0)],6)])})),128))],2)}},"./src/components/Document/Document.vue?vue&type=template&id=0fbf17a2&ts=true":function(e,t,n){n.d(t,{render:function(){return o.render}});var o=n("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/Document/Document.vue?vue&type=template&id=0fbf17a2&ts=true")}}]);