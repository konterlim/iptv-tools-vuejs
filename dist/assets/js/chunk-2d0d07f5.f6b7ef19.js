(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d07f5"],{"67db":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"contextMenu",staticClass:"context-menu-container",style:t.contextStyle,attrs:{id:t.id},on:{click:function(t){t.stopPropagation()},contextmenu:function(t){t.stopPropagation()}}},[i("div",{staticClass:"context"},[i("ul",{staticClass:"menu",class:[{"menu-align-right":t.right},t.depthClass],attrs:{role:"menu"}},[t._l(t.items,(function(e,n){return i("li",{key:"context-menu-"+n,on:{click:function(i){return i.preventDefault(),t.menuItemClick(e)}}},[e.divider?i("div",{staticClass:"hr px-4"}):i("a",{staticClass:"context-menu-item",class:{disabled:e.disabled},attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[i("i",{staticClass:"las",class:e.icon}),t._v(t._s(e.text))])])})),t._t("default")],2)])])},l=[],s=(i("a9e3"),i("ac1f"),i("5319"),i("d3b7"),i("ce96")),o={props:{id:{type:String,default:"context-menu"},right:{type:Boolean,default:!1},items:{type:Array,default:function(){return[]}},depth:{type:[String,Number],default:1}},data:function(){var t=this;return{locals:{},align:"left",top:0,left:0,visible:!1,bodyClickListener:Object(s["e"])((function(e){var i=!!t.visible,n=i&&!t.$el.contains(e.target);if(n){if(1!==e.which)return e.preventDefault(),e.stopPropagation(),!1;t.visible=!1,t.$emit("cancel",t.locals),e.stopPropagation()}else t.visible=!1,t.$emit("close",t.locals)}))}},methods:{setPositionFromEvent:function(t){var e=this;t=t||window.event;var i=document.scrollingElement||document.documentElement;return t.pageX||t.pageY?(this.left=t.pageX,this.top=t.pageY-i.scrollTop):(t.clientX||t.clientY)&&(this.left=t.clientX+i.scrollLeft,this.top=t.clientY+i.scrollTop),this.$nextTick((function(){var t=e.$el,i=(t.style.minHeight||t.style.height).replace("px","")||32,n=(t.style.minWidth||t.style.width).replace("px","")||32,l=t.scrollHeight||i,s=t.scrollWidth||n,o=window.innerHeight-l-25,c=window.innerWidth-s-25;e.top>o&&(e.top=o),e.left>c&&(e.left=c)})),t},open:function(t,e){return this.visible&&(this.visible=!1),this.visible=!0,this.$emit("open",this.locals=e||{}),this.setPositionFromEvent(t),this.$el.setAttribute("tab-index",-1),this.bodyClickListener.start(),this},menuItemClick:function(t){this.$emit("menu-click",t,this.locals),t.onClick&&"[object Function]"==={}.toString.call(t.onClick)&&t.onClick(t,this.locals)}},watch:{visible:function(t,e){!0===e&&!1===t&&this.bodyClickListener.stop((function(t){}))}},computed:{depthClass:function(){return"depth-".concat(this.depth)},contextStyle:function(){return{display:this.visible?"block":"none",top:(this.top||0)+"px",left:(this.left||0)+"px"}}}},c=o,a=i("2877"),r=Object(a["a"])(c,n,l,!1,null,null,null);e["default"]=r.exports}}]);