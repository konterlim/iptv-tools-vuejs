(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-44b8093c"],{"12e1":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:t.id}})},a=[],o=(n("a9e3"),n("a4d3"),n("e01a"),n("b9cd")),u={props:{id:{type:[String,Number],default:function(){return Object(o["a"])()}},buttonStyle:{type:Object,default:function(){return{label:"pay",size:"large",shape:"rect",color:"blue",tagline:!1,fundingicons:!0}}},value:{type:[String,Number],default:""},currency:{type:String,default:"EUR"},description:{type:String,default:""},items:{type:Array,default:function(){return[]}},brandName:{type:String,default:"IPTV-Tools by ERDesigns"}},methods:{createButton:function(){var t=this;paypal.Buttons({style:t.buttonStyle,createOrder:function(e,n){return n.order.create({application_context:{brand_name:t.brandName,shipping_preference:"NO_SHIPPING",user_action:"PAY_NOW"},payee:{email_address:"contact@erdesigns.eu"},purchase_units:[{amount:{currency_code:"EUR",value:t.value},description:t.description}]})},onApprove:function(e,n){return n.order.capture().then((function(e){t.$emit("approve",e)}))},onCancel:function(e){t.$emit("cancel",e)},onError:function(e){t.$emit("error",e)}}).render("#".concat(t.id))}},mounted:function(){this.createButton()}},c=u,i=(n("e5fa"),n("2877")),f=Object(i["a"])(c,r,a,!1,null,null,null);e["default"]=f.exports},"35b3":function(t,e,n){var r=n("23e7");r({target:"Number",stat:!0},{EPSILON:Math.pow(2,-52)})},"4fad":function(t,e,n){var r=n("23e7"),a=n("6f53").entries;r({target:"Object",stat:!0},{entries:function(t){return a(t)}})},"53ca":function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));n("a4d3"),n("e01a"),n("d3b7"),n("d28b"),n("3ca3"),n("ddb0");function r(t){return r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}},"6b93":function(t,e,n){var r=n("23e7"),a=Math.log,o=Math.LOG10E;r({target:"Math",stat:!0},{log10:function(t){return a(t)*o}})},"6f53":function(t,e,n){var r=n("83ab"),a=n("df75"),o=n("fc6a"),u=n("d1e7").f,c=function(t){return function(e){var n,c=o(e),i=a(c),f=i.length,d=0,s=[];while(f>d)n=i[d++],r&&!u.call(c,n)||s.push(t?[n,c[n]]:c[n]);return s}};t.exports={entries:c(!0),values:c(!1)}},"769a":function(t,e,n){},b9cd:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));n("5530");n("a4d3"),n("e01a"),n("d3b7"),n("d28b"),n("3ca3"),n("ddb0");n("06c5");n("ade3"),n("2909"),n("53ca"),n("4e82"),n("b0c0"),n("ac1f"),n("5319"),n("2b3d"),n("d81d"),n("1276"),n("498a"),n("99af"),n("a434"),n("4fad"),n("25f0"),n("466d"),n("35b3"),n("a9e3"),n("6b93");function r(){return"_"+Math.random().toString(36).substr(2,9)}},e5fa:function(t,e,n){"use strict";n("769a")}}]);
//# sourceMappingURL=chunk-44b8093c.86978db5.js.map