"use strict";require("../../sub-vendors.js");/*! For license information please see questionnaire.js.LICENSE.txt */
(wx.webpackJsonp=wx.webpackJsonp||[]).push([["packageA/pages/questionnaire/questionnaire"],{"./src/api/survey.ts":function(e,n,t){t.d(n,{getQuestionnaire:function(){return getQuestionnaire},submitQuestionnaire:function(){return i}});var s=t("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),o=t("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),u=t("./src/utils/http/index.ts"),a=function(e){return e.info="/api/questionnaire",e.submit="/api/questionnaire/submit",e}(a||{});function getQuestionnaire(e){return(0,u.get)({url:"".concat(a.info,"/").concat(e)})}var i=function(){var e=(0,o.default)((0,s.default)().mark((function _callee(e){return(0,s.default)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,u.post)({url:"".concat(a.submit),data:e}));case 1:case"end":return n.stop()}}),_callee)})));return function submitQuestionnaire(n){return e.apply(this,arguments)}}()},"./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/questionnaire/questionnaire.vue":function(e,n,t){var s=t("./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=template&id=2cb3729e&ts=true"),o=t("./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=script&setup=true&lang=ts"),u=t("./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=style&index=0&id=2cb3729e&lang=scss&module=true"),a=t("./node_modules/vue-loader/dist/exportHelper.js");const i={};i.$style=u.default;const r=(0,a.default)(o.default,[["render",s.render],["__cssModules",i],["__file","src/packageA/pages/questionnaire/questionnaire.vue"]]);n.default=r},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){var s=t("./node_modules/vue/index.js"),o=t("./src/components/LottieView/LottieView.vue"),u=t("./node_modules/@tarojs/taro/index.js"),a=t.n(u);n.default=(0,s.defineComponent)({__name:"QuestionnaireStatus",props:{title:{type:String,default:""},tips:{type:String,default:""},isAnimated:{type:Boolean,default:!1}},setup:function setup(e,n){(0,n.expose)();var t={goHome:function goHome(){a().switchTab({url:"/pages/index/index"})},LottieView:o.default};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){var s=t("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),o=t("./node_modules/vue/index.js"),u=t("./src/utils/index.ts");n.default=(0,o.defineComponent)({__name:"QuizCard",props:{active:{type:Boolean,default:!1},index:{type:Number,default:0},listLength:{type:Number,default:0},questionIndex:{type:Number,default:0},info:{type:Object,default:function _default(){return{}}},isNextItem:{type:Boolean,default:!1}},emits:["answerSelected","next"],setup:function setup(e,n){var t=n.expose,a=n.emit,i=e,r=(0,o.ref)(),l=(0,o.ref)(!1),d=(0,o.computed)((function(){return i.active})),c=(0,o.computed)((function(){return i.info})),p=(0,o.computed)((function(){return{zIndex:d.value?99:i.index>i.questionIndex?i.listLength-i.index:1,boxShadow:i.isNextItem||i.index===i.listLength-1?"0px 4px 10px 0px rgba(165, 165, 165, 0.65)":"none"}})),m=function showAnimations(){l.value=!0};t({showAnimations:m});var _={emits:a,props:i,selectedIndex:r,isAnimations:l,isActive:d,data:c,cardStyle:p,selectAnswer:function selectAnswer(e,n){d.value&&!l.value&&(a("answerSelected",{answer:[(0,s.default)({},e)],questionId:c.value.id}),r.value=n)},showAnimations:m,processedText:function processedText(e){return e.slice(0,8)},padNumber:function padNumber(e){return e.toString().padStart(2,"0")},get imageProcess(){return u.imageProcess}};return Object.defineProperty(_,"__isScriptSetup",{enumerable:!1,value:!0}),_}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){var s=t("./node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"),o=t("./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"),u=t("./node_modules/vue/index.js"),a=t("./src/api/survey.ts"),i=t("./src/components/BackgroundImage/BackgroundImage.vue"),r=t("./src/components/CustomBar/CustomBar.vue"),l=t("./src/components/CustomBar/props.ts"),d=t("./src/components/Loading/Loading.vue"),c=t("./src/utils/index.ts"),p=t("./src/utils/track/index.ts"),m=t("./src/utils/track/config.ts"),_=t("./node_modules/@tarojs/taro/index.js"),g=t.n(_),v=t("./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue"),f=t("./src/packageA/pages/questionnaire/components/QuizCard.vue");n.default=(0,u.defineComponent)({__name:"questionnaire",setup:function setup(e,n){(0,n.expose)();var t=(0,_.getApp)()["".concat("zippo")],b=(0,m.getRefererPath)(),j=(0,_.useRouter)(),x=(0,u.ref)(Number(j.params.id)),k=(0,u.ref)(!1),y=(0,u.ref)(!1),S=(0,u.ref)(),w=(0,u.ref)(0),q=(0,u.ref)(0),A=(0,u.ref)(),C=(0,u.ref)([]),Q=(0,u.ref)(!1),h="questionState_".concat(x.value),N=(0,u.computed)((function(){var e,n;return k.value&&((null===(e=S.value)||void 0===e?void 0:e.isComplete)||!(null!==(n=S.value)&&void 0!==n&&n.isCan))})),z=(0,u.computed)((function(){var e,n,t={title:"",tips:"",isAnimated:!1};return null!==(e=S.value)&&void 0!==e&&e.isComplete&&(t.title="提交成功",t.tips="感谢您百忙之中完成问答",t.isAnimated=!0),null!==(n=S.value)&&void 0!==n&&n.isCan||(t.title="提示",t.tips="此问卷处于停止状态，无法填写",t.isAnimated=!1),t})),B=function(){var e=(0,o.default)((0,s.default)().mark((function _callee(){var e;return(0,s.default)().wrap((function _callee$(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,(0,a.getQuestionnaire)(x.value);case 3:e=n.sent,S.value=e,k.value=!0,n.next=12;break;case 8:n.prev=8,n.t0=n.catch(0),(0,c.Toast)("加载失败",2e3,"none",!0,(function(){setTimeout((function(){(0,c.goBack)()}),1500)})),console.error("pointOrderList load err=",n.t0);case 12:case"end":return n.stop()}}),_callee,null,[[0,8]])})));return function fetchQuestions(){return e.apply(this,arguments)}}();function _submitAnswers(){return(_submitAnswers=(0,o.default)((0,s.default)().mark((function _callee3(){var e,n,o;return(0,s.default)().wrap((function _callee3$(s){for(;;)switch(s.prev=s.next){case 0:return e={questionnaireId:x.value,content:C.value},console.debug("params: =====",e),Q.value=!0,s.prev=3,s.next=6,(0,a.submitQuestionnaire)({questionnaireId:x.value,content:C.value});case 6:n=s.sent,S.value&&(S.value.isComplete=!0),s.next=13;break;case 10:s.prev=10,s.t0=s.catch(3),console.error("pointOrderList load err=",s.t0);case 13:return s.prev=13,Q.value=!1,s.finish(13);case 16:n&&t&&(t.track({event:p.ELinkflowEventsName.InteractiveTask_Questionnaire_Submit,props:{s_questionnaireId:"".concat(x.value||""),s_questionnaireName:(null===(o=S.value)||void 0===o?void 0:o.title)||"",triggerPagePath:b}}),C.value.forEach((function(e,n){var s,o,u;t.track({event:p.ELinkflowEventsName.InteractiveTask_Questionnaire_Answer,props:{s_questionnaireId:"".concat(x.value||""),s_questionnaireName:(null===(s=S.value)||void 0===s?void 0:s.title)||"",s_question:(null===(o=S.value)||void 0===o||null===(u=o.questions.find((function(n){return n.id===e.questionId})))||void 0===u?void 0:u.title)||"",s_questionNumber:"".concat(n+1),s_answer:e.answer[0].value||"",triggerPagePath:b}})})));case 17:case"end":return s.stop()}}),_callee3,null,[[3,10,13,16]])})))).apply(this,arguments)}var L=function nextCard(){var e,n;if(null!==(e=S.value)&&void 0!==e&&e.questions.length&&(null===(n=S.value)||void 0===n?void 0:n.questions.length)-1===w.value)return y.value=!0;A.value[w.value].showAnimations(),y.value=!1},I=function goShopPage(){g().reLaunch({url:"/pages/pointmall/pointmall"})};function getStorage(){var e=g().getStorageSync(h);e&&(w.value=e.questionIndex,q.value=e.questionIndex-1,C.value=e.answers)}(0,u.provide)("back",I),(0,_.useUnload)((function(){g().setStorageSync(h,{questionIndex:w.value,answers:C.value})})),(0,u.onMounted)((0,o.default)((0,s.default)().mark((function _callee2(){return(0,s.default)().wrap((function _callee2$(e){for(;;)switch(e.prev=e.next){case 0:getStorage(),B();case 2:case"end":return e.stop()}}),_callee2)}))));var R={linkflow:t,triggerPagePath:b,router:j,activityId:x,isLoading:k,canSubmit:y,cardsInfo:S,currentQuestionIndex:w,questionIndex:q,quizCard:A,selectedAnswers:C,loadingSubmit:Q,storageKey:h,showStatus:N,statusText:z,fetchQuestions:B,handleAnswerSelection:function handleAnswerSelection(e){var n=e.answer,t=e.questionId;console.debug("handleAnswerSelection event=",{answer:n,questionId:t}),C.value[w.value]={questionId:t,answer:n},L()},submitAnswers:function submitAnswers(){return _submitAnswers.apply(this,arguments)},nextCard:L,goShopPage:I,getStorage:getStorage,BackgroundImage:i.default,CustomBar:r.default,get LogoColorType(){return l.LogoColorType},Loading:d.default,QuestionnaireStatus:v.default,QuizCard:f.default};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}})},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=template&id=9881fb84&ts=true":function(e,n,t){t.d(n,{render:function(){return render}});var s=t("./node_modules/@nutui/nutui-taro/dist/packages/button/index.mjs"),o=(t("./node_modules/@nutui/nutui-taro/dist/packages/button/style.mjs"),t("./node_modules/vue/index.js")),u=t("./src/packageA/image/warning.png");function render(e,n,t,a,i,r){var l=s.Button;return(0,o.openBlock)(),(0,o.createElementBlock)("view",{class:(0,o.normalizeClass)([e.$style.content,"nut-flex-col nut-col-center nut-row-center f_w-400"])},[t.isAnimated?(0,o.createCommentVNode)("v-if",!0):((0,o.openBlock)(),(0,o.createElementBlock)("image",{key:0,class:(0,o.normalizeClass)([e.$style.icon,"mg-bottom-16"]),src:u},null,2)),t.isAnimated?((0,o.openBlock)(),(0,o.createBlock)(a.LottieView,{key:1,class:"mg-bottom-16",autoplay:!0,loop:!1,"assets-path":"static/success3.json"})):(0,o.createCommentVNode)("v-if",!0),(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.title,"f_s-20"])},(0,o.toDisplayString)(t.title),3),(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.tips,"f_s-14"])},(0,o.toDisplayString)(t.tips),3),(0,o.createVNode)(l,{class:(0,o.normalizeClass)(e.$style.btn),type:"default",plain:"",onTap:a.goHome},{default:(0,o.withCtx)((function(){return[(0,o.createTextVNode)("返回首页")]})),_:1},8,["class"])],2)}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=template&id=671b05e8&ts=true":function(e,n,t){t.d(n,{render:function(){return render}});var s=t("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),o=t("./node_modules/vue/index.js"),u=["src"],a=["onTap"];function render(e,n,t,i,r,l){return(0,o.openBlock)(),(0,o.createElementBlock)("view",{class:(0,o.normalizeClass)([e.$style.card,(0,s.default)({},e.$style["rotate-out-2-br-cw"],i.isAnimations)]),style:(0,o.normalizeStyle)(i.cardStyle),onAnimationend:n[0]||(n[0]=function(e){return i.emits("next")})},[(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.number,"numfnt f_s-12 f_w-500"])},(0,o.toDisplayString)(i.padNumber(t.index+1))+"/"+(0,o.toDisplayString)(i.padNumber(t.listLength)),3),(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.content,(0,s.default)({},e.$style.content_centered,!i.data.image)])},[i.data.image?((0,o.openBlock)(),(0,o.createElementBlock)("image",{key:0,class:(0,o.normalizeClass)(e.$style.img),src:i.imageProcess(i.data.image,"L")},null,10,u)):(0,o.createCommentVNode)("v-if",!0),(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.title,"f_s-16 f_w-600"])},(0,o.toDisplayString)(i.data.title),3),(0,o.createElementVNode)("view",{class:(0,o.normalizeClass)([e.$style.options,"nut-flex nut-flex-wrap nut-row-between f_s-12 f_w-400"])},[((0,o.openBlock)(!0),(0,o.createElementBlock)(o.Fragment,null,(0,o.renderList)(i.data.options,(function(n,t){return(0,o.openBlock)(),(0,o.createElementBlock)("view",{class:(0,o.normalizeClass)([[e.$style.options_item,(0,s.default)({},e.$style["options_item-on"],i.selectedIndex===t)],"nut-flex nut-row-center f_s-14 f_w-400"]),key:n.key,onTap:function onTap(e){return i.selectAnswer(n,t)}},[(0,o.createElementVNode)("text",null,(0,o.toDisplayString)(i.processedText(n.value)),1)],42,a)})),128))],2)],2)],38)}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=template&id=2cb3729e&ts=true":function(e,n,t){t.d(n,{render:function(){return render}});var s=t("./node_modules/@nutui/nutui-taro/dist/packages/button/index.mjs"),o=(t("./node_modules/@nutui/nutui-taro/dist/packages/button/style.mjs"),t("./node_modules/@babel/runtime/helpers/esm/defineProperty.js")),u=t("./node_modules/vue/index.js"),a={key:0};function render(e,n,t,i,r,l){var d=s.Button;return(0,u.openBlock)(),(0,u.createBlock)(i.BackgroundImage,{class:(0,u.normalizeClass)(e.$style.container)},{default:(0,u.withCtx)((function(){var t;return[(0,u.createVNode)(i.CustomBar,{title:"","bg-color":"transparent","logo-color":i.LogoColorType.BLACK},null,8,["logo-color"]),i.isLoading?((0,u.openBlock)(),(0,u.createElementBlock)("view",{key:0,class:(0,u.normalizeClass)(e.$style.main)},[i.showStatus?(0,u.createCommentVNode)("v-if",!0):((0,u.openBlock)(),(0,u.createElementBlock)("block",a,[(0,u.createElementVNode)("view",{class:(0,u.normalizeClass)(e.$style.main_content)},[((0,u.openBlock)(!0),(0,u.createElementBlock)(u.Fragment,null,(0,u.renderList)(null===(t=i.cardsInfo)||void 0===t?void 0:t.questions,(function(e,t){var s;return(0,u.openBlock)(),(0,u.createElementBlock)("block",{key:e.id},[(0,u.withDirectives)((0,u.createVNode)(i.QuizCard,{info:e,index:t,active:t===i.currentQuestionIndex,questionIndex:i.questionIndex,isNextItem:t===i.currentQuestionIndex+1,listLength:null===(s=i.cardsInfo)||void 0===s?void 0:s.questions.length,onAnswerSelected:i.handleAnswerSelection,onNext:n[0]||(n[0]=function(e){return i.currentQuestionIndex+=1}),ref_for:!0,ref:"quizCard"},null,8,["info","index","active","questionIndex","isNextItem","listLength"]),[[u.vShow,t>=i.questionIndex]])])})),128))],2),(0,u.createElementVNode)("view",{class:(0,u.normalizeClass)(e.$style.footer)},[(0,u.createVNode)(d,{class:(0,u.normalizeClass)([e.$style.btn,(0,o.default)({},e.$style["btn-submit"],i.canSubmit)]),disabled:!i.canSubmit,type:"default",plain:"",loading:i.loadingSubmit,onClick:i.submitAnswers},{default:(0,u.withCtx)((function(){return[(0,u.createTextVNode)("提交")]})),_:1},8,["class","disabled","loading"])],2)])),(0,u.createCommentVNode)(" 状态 "),i.showStatus?((0,u.openBlock)(),(0,u.createBlock)(i.QuestionnaireStatus,{key:1,title:i.statusText.title,tips:i.statusText.tips,isAnimated:i.statusText.isAnimated},null,8,["title","tips","isAnimated"])):(0,u.createCommentVNode)("v-if",!0)],2)):(0,u.createCommentVNode)("v-if",!0),(0,u.createVNode)(i.Loading,{show:!i.isLoading},null,8,["show"])]})),_:1},8,["class"])}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=style&index=0&id=9881fb84&lang=scss&module=true":function(e,n){n.default={content:"QuestionnaireStatus__content___pQTA2",title:"QuestionnaireStatus__title___EYR2p",tips:"QuestionnaireStatus__tips___LpWzm",icon:"QuestionnaireStatus__icon___tgVlu",btn:"QuestionnaireStatus__btn___eGDM0","slide-bottom":"QuestionnaireStatus__slide-bottom___tOgHT"}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=style&index=0&id=671b05e8&lang=scss&module=true":function(e,n){n.default={card:"QuizCard__card___MRWuh",content:"QuizCard__content___tEBrm",content_centered:"QuizCard__content_centered___uLNNy",img:"QuizCard__img___gV0Q9",title:"QuizCard__title___q_7a_",options:"QuizCard__options___mIuZn",options_item:"QuizCard__options_item___J4POs","options_item-on":"QuizCard__options_item-on___OhZx6","rotate-out-2-br-cw":"QuizCard__rotate-out-2-br-cw___YyQDc","slide-bottom":"QuizCard__slide-bottom___PJbsd"}},"./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=style&index=0&id=2cb3729e&lang=scss&module=true":function(e,n){n.default={container:"questionnaire__container___DKOvG",main:"questionnaire__main___ElAK0",main_content:"questionnaire__main_content___UQvgB",footer:"questionnaire__footer___LzKW6",btn:"questionnaire__btn___nsu4k","btn-submit":"questionnaire__btn-submit___GyIlT","slide-bottom":"questionnaire__slide-bottom___rtIas"}},"./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue":function(e,n,t){var s=t("./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=template&id=9881fb84&ts=true"),o=t("./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=script&setup=true&lang=ts"),u=t("./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=style&index=0&id=9881fb84&lang=scss&module=true"),a=t("./node_modules/vue-loader/dist/exportHelper.js");const i={};i.$style=u.default;const r=(0,a.default)(o.default,[["render",s.render],["__cssModules",i],["__file","src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue"]]);n.default=r},"./src/packageA/pages/questionnaire/components/QuizCard.vue":function(e,n,t){var s=t("./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=template&id=671b05e8&ts=true"),o=t("./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=script&setup=true&lang=ts"),u=t("./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=style&index=0&id=671b05e8&lang=scss&module=true"),a=t("./node_modules/vue-loader/dist/exportHelper.js");const i={};i.$style=u.default;const r=(0,a.default)(o.default,[["render",s.render],["__cssModules",i],["__file","src/packageA/pages/questionnaire/components/QuizCard.vue"]]);n.default=r},"./src/packageA/pages/questionnaire/questionnaire.vue":function(e,n,t){var s=t("./node_modules/@tarojs/runtime/dist/runtime.esm.js"),o=t("./node_modules/@tarojs/taro-loader/lib/raw.js!./src/packageA/pages/questionnaire/questionnaire.vue");Page((0,s.createPageConfig)(o.default,"packageA/pages/questionnaire/questionnaire",{root:{cn:[]}},{}||{})),o.default},"./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=script&setup=true&lang=ts":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=script&setup=true&lang=ts")},"./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=template&id=9881fb84&ts=true":function(e,n,t){t.d(n,{render:function(){return s.render}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=template&id=9881fb84&ts=true")},"./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=template&id=671b05e8&ts=true":function(e,n,t){t.d(n,{render:function(){return s.render}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=template&id=671b05e8&ts=true")},"./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=template&id=2cb3729e&ts=true":function(e,n,t){t.d(n,{render:function(){return s.render}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/babel-loader/lib/index.js??clonedRuleSet-21.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=template&id=2cb3729e&ts=true")},"./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=style&index=0&id=9881fb84&lang=scss&module=true":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuestionnaireStatus.vue?vue&type=style&index=0&id=9881fb84&lang=scss&module=true")},"./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=style&index=0&id=671b05e8&lang=scss&module=true":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/components/QuizCard.vue?vue&type=style&index=0&id=671b05e8&lang=scss&module=true")},"./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=style&index=0&id=2cb3729e&lang=scss&module=true":function(e,n,t){t.d(n,{default:function(){return s.default}});var s=t("./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/@tarojs/webpack5-runner/node_modules/css-loader/dist/cjs.js??clonedRuleSet-7.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-7.use[2]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-7.use[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/packageA/pages/questionnaire/questionnaire.vue?vue&type=style&index=0&id=2cb3729e&lang=scss&module=true")},"./src/packageA/image/warning.png":function(e,n,t){e.exports=t.p+"packageA/image/warning.png"}},function(e){e.O(0,["taro","vendors","common"],(function(){return n="./src/packageA/pages/questionnaire/questionnaire.vue",e(e.s=n);var n}));e.O()}]);