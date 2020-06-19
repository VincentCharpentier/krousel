parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"LItN":[function(require,module,exports) {
var t={SLIDE:"slide",FADE:"fade"},e={appendArrows:null,appendDots:null,arrows:!0,autoplay:!1,autoplaySpeed:3e3,dots:!0,infinite:!0,nextArrow:null,pauseOnHover:!0,prevArrow:null,responsive:null,slidesToShow:1,slidesToScroll:1,speed:300,swipe:!0,transition:t.SLIDE,_forceAppendPrevArrow:!1,_forceAppendNextArrow:!1,draggable:!0,rtl:!1},i=function(t){function e(e){t.call(this),this.errorCode=e}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(Error),s={className:"class"},o=function(t,e,i){void 0===e&&(e={}),void 0===i&&(i=null);var o=document.createElement(t);return Object.entries(e).forEach(function(t){var e=t[0];o.setAttribute(s[e]||e,t[1])}),i&&(i instanceof Array?i.forEach(function(t){return o.appendChild(t)}):o.appendChild(i)),o};function r(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];return t.filter(function(t){return!!t}).join(" ")}var n={};n[t.SLIDE]="k-tr-slide",n[t.FADE]="k-tr-fade";var a=function(t,e){return t instanceof e},h=Object.values(t),_=["slidesToShow","slidesToScroll","infinite"];function p(t){return t.touches?"touchend"===t.type?t.changedTouches[0].clientX:t.touches[0].clientX:t.clientX}var u=function(t,s){this._setupOptions=function(t){var i=Object.assign({},t),s=function(t,e,i){return console.warn("Krousel - Invalid option '"+t+"' will be ignored. Expected "+e+", got: "+i)},o=t.appendDots,r=t.transition;o&&!a(o,HTMLElement)&&(s("appendDots","HTMLElement",o.constructor&&o.constructor.name||o.prototype&&o.prototype.name||o),delete i.appendDots),r&&!h.includes(r)&&(s("transition","oneOf "+h.join("|"),r),delete i.transition);var n=Object.assign({},e,i);return n.responsive&&n.responsive.sort(function(t,e){return t.breakpoint-e.breakpoint}),n}(s),this._target=function(t){var e=t;if("string"==typeof t)e=document.getElementById(t);else{if(!a(t,HTMLElement))throw new i(1);e=t}return e}(t),this._initialized=!1,this._currentPage=0,this._dragInitialOffset=0,this._showPrev=this._showPrev.bind(this),this._showNext=this._showNext.bind(this),this._enableTransition=this._enableTransition.bind(this),this._handleResize=this._handleResize.bind(this),this._stopAutoplay=this._stopAutoplay.bind(this),this._startAutoplay=this._startAutoplay.bind(this),this._resumeAutoplay=this._resumeAutoplay.bind(this),this._pauseAutoplay=this._pauseAutoplay.bind(this),this._doAutoplay=this._doAutoplay.bind(this),this._requestNext=this._requestNext.bind(this),this._requestPrev=this._requestPrev.bind(this),this._requestGoTo=this._requestGoTo.bind(this),this._startDragging=this._startDragging.bind(this),this._onDragMouseMove=this._onDragMouseMove.bind(this),this._endDragging=this._endDragging.bind(this),this._computeOptions(),this._computeProps(),this._setupDOM(),this._initialized=!0,this._startAutoplay()};u.prototype._computeOptions=function(){var t,e,i={},s=function(t){var e,i=t.responsive,s=null;if(i){for(var o=0,r=i;o<r.length;o+=1){var n=r[o];if(window.innerWidth<=n.breakpoint){s=n;break}}s&&(s.settings=(e=s.settings,_.reduce(function(t,i){return e.hasOwnProperty(i)&&(t[i]=e[i]),t},{})))}return s}(this._setupOptions);if(s!==this._breakpoint){var o=Object.assign({},this._setupOptions,s&&s.settings);this._options&&(t=this._options,e=o,i=Array.from(new Set(Object.keys(t).concat(Object.keys(e)))).reduce(function(i,s){return t[s]!==e[s]&&(i[s]=e[s]),i},{})),this._breakpoint=s,this._options=o}return i},u.prototype._setCssVar=function(t,e){this._target.style.setProperty(t,e)},u.prototype._computeProps=function(){var e=this._options,i=e.infinite,s=e.slidesToShow,o=e.slidesToScroll,r=e.transition;this._slideCount=this._initialized?this._track.querySelectorAll(".k-slide:not(.k-slide-cloned)").length:this._target.childElementCount,this._pageCount=Math.ceil((this._slideCount+o-s)/o),this._currentPage=Math.min(this._currentPage,this._pageCount-1),this._hasClones=i&&r===t.SLIDE,this._clonePerSide=this._hasClones?2*s:0},u.prototype._setupDOM=function(){var t,e=this,i=this._options,s=i.transition,a=i.speed,h=Array.from(this._target.children);this._target.classList.add("krousel"),this._track=o("div",{className:r("k-track",n[s]),style:(t={transitionDuration:a+"ms"},Object.entries(t).map(function(t){var e=t[1];return t[0].replace(/[A-Z]/g,function(t){return"-"+t.toLowerCase()})+":"+e}).join(";"))}),this._disableTransition(),this._trackContainer=o("div",{className:"k-track-container"},this._track),this._target.appendChild(this._trackContainer),this._setupArrowsDOM(),this._setupDotsDOM(),this._setCssVar("--slide-didx",this._clonePerSide),this._computeSize(),h.forEach(function(t){t instanceof HTMLElement&&(t.classList.add("k-slide"),e._track.appendChild(t))}),this._hasClones&&this._setupInfiniteDOM(),this._computeSlidesClasses(0),this.__forceReflow(),this._enableTransition(),this._setupListeners()},u.prototype._setupInfiniteDOM=function(){for(var t=this,e=Array.from(this._track.querySelectorAll(".k-slide")),i=this._track.firstChild,s=e;s.length<this._clonePerSide;)s=s.concat(e);var o=s.slice(-this._clonePerSide).map(function(t){var e=t.cloneNode(!0);return e.classList.add("k-slide-cloned"),e});s.slice(0,this._clonePerSide).forEach(function(e){var i=e.cloneNode(!0);i.classList.add("k-slide-cloned"),t._track.appendChild(i)}),o.forEach(function(e){return t._track.insertBefore(e,i)})},u.prototype._setupArrowsDOM=function(){var t=this._options,e=t._forceAppendPrevArrow,i=t._forceAppendNextArrow,s=t.appendArrows,r=t.nextArrow;if(t.arrows){this._prevArrow=t.prevArrow||o("div"),this._prevArrow.classList.add("k-arrow-left"),this._nextArrow=r||o("div"),this._nextArrow.classList.add("k-arrow-right");var n=s||this._trackContainer;!e&&this._prevArrow.isConnected||(n.childElementCount>0?n.insertBefore(this._prevArrow,n.firstChild):n.appendChild(this._prevArrow)),!i&&this._nextArrow.isConnected||n.appendChild(this._nextArrow)}},u.prototype._setupDotsDOM=function(){var t=this._options,e=t.appendDots;if(t.dots){this._dots&&this._dots.remove();var i=new Array(this._pageCount).fill(null).map(function(t){return o("div",{className:"k-dot"})});this._dots=o("div",{className:"k-dots"},i),(e||this._target).appendChild(this._dots)}},u.prototype._setupListeners=function(){var t,e,i,s=this,o=this._options,r=o.arrows,n=o.dots,a=o.autoplay,h=o.pauseOnHover,_=o.swipe;if(window.addEventListener("resize",(t=this._handleResize,e=100,function(){for(var s=[],o=arguments.length;o--;)s[o]=arguments[o];clearTimeout(i),i=setTimeout.apply(void 0,[t,e].concat(s))})),r&&(this._prevArrow.addEventListener("click",this._requestPrev),this._nextArrow.addEventListener("click",this._requestNext)),n&&this._dots.querySelectorAll(".k-dot").forEach(function(t,e){return t.addEventListener("click",function(){return s._requestGoTo(e)})}),a){var p=this._track.querySelectorAll(".k-slide"),u=function(t){!t.currentTarget.contains(t.relatedTarget)&&s._resumeAutoplay()};h&&p.forEach(function(t){t.addEventListener("mouseenter",s._pauseAutoplay),t.addEventListener("mouseout",u)})}if(_){var d=function t(e){window.removeEventListener("mousemove",s._onDragMouseMove),window.removeEventListener("touchmove",s._onDragMouseMove),window.removeEventListener("mouseup",t),window.removeEventListener("touchend",t),s._endDragging(e)},l=function(t){window.addEventListener("mouseup",d),window.addEventListener("touchend",d),window.addEventListener("mousemove",s._onDragMouseMove),window.addEventListener("touchmove",s._onDragMouseMove),s._startDragging(t)};this._track.addEventListener("mousedown",l),this._track.addEventListener("touchstart",l)}},u.prototype._computeSlideIdxFromDragX=function(e){var i=this._options,s=i.transition,o=i.slidesToShow,r=Math.round(-e/this._slideWidth-this._clonePerSide);return s!==t.SLIDE&&(r+=this._currentPage*o),r},u.prototype._computeDragX=function(t){var e=this._options.infinite,i=p(t),s=this._dragInitialOffset+(i-this._dragStartX);return e||(s=Math.min(Math.max(s,-this._slideWidth*(this._slideCount-1)),0)),s},u.prototype._startDragging=function(e){var i=this._options.transition===t.SLIDE;this._dragStartX=p(e),this._dragStartTime=Date.now(),this._dragInitialOffset=i?new DOMMatrix(getComputedStyle(this._track).transform).m41:0,this._pauseAutoplay(),i&&this._disableTransition()},u.prototype._onDragMouseMove=function(e){var i=this._options.transition,s=this._computeDragX(e);i===t.SLIDE&&this._track.style.setProperty("--dX",s+"px");var o=this._computeSlideIdxFromDragX(s);this._computeSlidesClasses(o)},u.prototype._endDragging=function(t){var e=this._options,i=e.slidesToScroll,s=e.slidesToShow,o=this._computeDragX(t);this._enableTransition(),this._track.style.removeProperty("--dX");var r=this._computeSlideIdxFromDragX(o),n=Math.round(r/i);if(n===this._currentPage){var a=Date.now()-this._dragStartTime,h=p(t)-this._dragStartX,_=Math.abs(h),u=s*this._slideWidth;a<500&&_>.3*u&&_<u&&(n=this._currentPage-Math.sign(h))}this._goToPage(n),this._resumeAutoplay()},u.prototype._startAutoplay=function(){this._options.autoplay&&(this._apStopped=!1,this._resumeAutoplay())},u.prototype._pauseAutoplay=function(){clearTimeout(this._autoplayTimer)},u.prototype._resumeAutoplay=function(){var t=this._options,e=t.autoplaySpeed;t.autoplay&&!this._apStopped&&(clearTimeout(this._autoplayTimer),this._autoplayTimer=setTimeout(this._doAutoplay,e))},u.prototype._stopAutoplay=function(){this._apStopped=!0,this._pauseAutoplay()},u.prototype._doAutoplay=function(){var t=this._options,e=t.speed,i=t.autoplaySpeed;this._showNext(),this._autoplayTimer=setTimeout(this._doAutoplay,i+e)},u.prototype._handleResize=function(){var t=this._options.responsive;if(this._disableTransition(),t){var e=this._computeOptions();this._computeProps(),this._processOptionsChange(e)}this._computeSize(),t&&(this._setupDotsDOM(),this._goToPage(this._currentPage)),this.__forceReflow(),this._enableTransition()},u.prototype._processOptionsChange=function(t){["infinite","slidesToShow"].some(function(e){return t.hasOwnProperty(e)})&&(this._track.querySelectorAll(".k-slide-cloned").forEach(function(t){return t.remove()}),this._hasClones&&this._setupInfiniteDOM())},u.prototype._cleanUpDOM=function(){},u.prototype._computeSlidesClasses=function(t){for(var e=this._options,i=e.dots,s=e.slidesToShow,o=[],r=t;r<t+s;r++){var n=r+this._clonePerSide;o.push(n),r<0?o.push(n+this._slideCount):r>=this._slideCount&&o.push(n-this._slideCount)}if(this._track.querySelectorAll(".k-slide").forEach(function(t,e){o.includes(e)?t.classList.add("k-slide-visible"):t.classList.remove("k-slide-visible")}),this._computeArrowClasses(),i){var a=this._dots.querySelectorAll(".k-dot");a.forEach(function(t){return t.classList.remove("k-current")}),a.length>0&&a[this._currentPage].classList.add("k-current")}},u.prototype._computeArrowClasses=function(){var t=this._options;t.arrows&&(t.infinite?(this._prevArrow.classList.remove("k-arrow-disabled"),this._nextArrow.classList.remove("k-arrow-disabled")):(0===this._currentPage?this._prevArrow.classList.add("k-arrow-disabled"):this._prevArrow.classList.remove("k-arrow-disabled"),this._currentPage===this._pageCount-1?this._nextArrow.classList.add("k-arrow-disabled"):this._nextArrow.classList.remove("k-arrow-disabled")))},u.prototype._goToPage=function(t){var e=this;if(this.__goToPage_defer)return this.__goToPage_defer(),void this._goToPage(t);var i,s=this._options,o=s.slidesToShow,r=s.slidesToScroll,n=s.speed,a=!1,h=t;t>=this._pageCount?(h=0,a=!0):t<0&&(h=this._pageCount-1,a=!0),this._currentPage=h,i=t>=this._pageCount?this._slideCount:t<0?-o:t*r,t===this._pageCount-1&&i>this._slideCount-o&&(i=this._slideCount-o),i=Math.min(Math.max(i,-o),this._slideCount),this._computeSlidesClasses(i),this._setCssVar("--slide-didx",i+this._clonePerSide),a&&(this.__goToPage_defer=function(){delete e.__goToPage_defer,clearTimeout(e.__goToPage_timer),e._disableTransition(),e._goToPage(h),e.__forceReflow(),e._enableTransition()},this.__goToPage_timer=setTimeout(this.__goToPage_defer,n))},u.prototype.__forceReflow=function(){this._reflowTrash=this._track.offsetHeight},u.prototype._enableTransition=function(){this._track.classList.remove("k-no-transition")},u.prototype._disableTransition=function(){this._track.classList.add("k-no-transition")},u.prototype._computeSize=function(){var e=this._options,i=e.transition,s=2*this._clonePerSide;this._slideWidth=this._trackContainer.clientWidth/e.slidesToShow,this._setCssVar("--slide-width",this._slideWidth+"px"),i===t.SLIDE&&(this._track.style.width=(s+this._slideCount)*this._slideWidth+1e3+"px")},u.prototype._showNext=function(){(this._options.infinite||this._currentPage<this._pageCount-1)&&this._goToPage(this._currentPage+1)},u.prototype._showPrev=function(){(this._options.infinite||this._currentPage>0)&&this._goToPage(this._currentPage-1)},u.prototype._requestNext=function(){this._stopAutoplay(),this._showNext()},u.prototype._requestPrev=function(){this._stopAutoplay(),this._showPrev()},u.prototype._requestGoTo=function(t){this._stopAutoplay(),this._goToPage(t)},module.exports=u;
},{}],"Focm":[function(require,module,exports) {
"use strict";var e=n(require("../dist/krousel"));function n(e){return e&&e.__esModule?e:{default:e}}function t(e,n){if(null==e)return{};var t,r,l=o(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}function o(e,n){if(null==e)return{};var t,o,r={},l=Object.keys(e);for(o=0;o<l.length;o++)t=l[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}function r(n){var o=n.count,r=void 0===o?5:o,l=n.name,a=void 0===l?"":l,i=n.className,s=t(n,["count","name","className"]),d=document.createElement("section");i&&d.classList.add(i);var c=document.createElement("h1");c.innerHTML=a,d.appendChild(c);var u=document.createElement("pre");u.innerHTML=JSON.stringify(s,function(e,n){return n instanceof HTMLElement?n.constructor.name:n},2),d.appendChild(u);var p=document.createElement("div");d.appendChild(p),new Array(r).fill(null).forEach(function(e,n){var t=document.createElement("div"),o=document.createElement("h3");o.innerHTML=(n+1).toString();var l=Math.round(n/r*360);o.style.backgroundColor="hsl(".concat(l,", 60%, 60%)"),t.appendChild(o),p.append(t)}),document.getElementById("target").appendChild(d),new e.default(p,s)}var l=[{name:"Simple demo",count:5,infinite:!1},{name:"Infinite loop (default)",count:5,infinite:!0},{name:"Transition speed",count:5,speed:1e3,className:"slow"},{name:"Transition Type",count:5,transition:"fade"},{name:"Autoplay (pause when hovered)",count:2,autoplay:!0,autoplaySpeed:3e3,pauseOnHover:!0,infinite:!0},{name:"Disable arrows",count:5,arrows:!1,autoplay:!0},{name:"Show multiple",count:5,slidesToShow:2},{name:"Scroll multiple",count:5,slidesToShow:2,slidesToScroll:2},{name:"Scroll multiple",count:25,slidesToShow:4,slidesToScroll:3},{name:"Hide dots",count:5,dots:!1},{name:"Responsive",count:10,slidesToShow:3,slidesToScroll:3,responsive:[{breakpoint:600,settings:{slidesToShow:2,slidesToScroll:2}},{breakpoint:400,settings:{infinite:!1,slidesToShow:1,slidesToScroll:1}}]}];window.addEventListener("load",function(){l.map(r);var n=document.getElementById("hoverEffect"),t=n.querySelector(".slider");new e.default(t,{slidesToShow:3,appendArrows:t,appendDots:n}),(n=document.getElementById("customTargets")).querySelector("pre").innerHTML="{\n  appendDots: HTMLElement\n  appendArrows: HTMLElement\n}",new e.default(n.querySelector(".slider"),{appendDots:n.querySelector(".top-zone"),appendArrows:n.querySelector(".top-zone")}),(n=document.getElementById("customArrows")).querySelector("pre").innerHTML="{\n  prevArrow: HTMLElement\n  nextArrow: HTMLElement\n}",new e.default(n.querySelector(".slider"),{prevArrow:n.querySelector(".go-prev"),nextArrow:n.querySelector(".go-next")})});
},{"../dist/krousel":"LItN"}]},{},["Focm"], null)
//# sourceMappingURL=examples.864275e8.js.map