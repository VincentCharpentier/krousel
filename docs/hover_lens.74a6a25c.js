parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"dRSj":[function(require,module,exports) {

},{}],"uS2Q":[function(require,module,exports) {
"use strict";function e(e){return o(e)||n(e)||t(e)||r()}function r(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function t(e,r){if(e){if("string"==typeof e)return a(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?a(e,r):void 0}}function n(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function o(e){if(Array.isArray(e))return a(e)}function a(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function i(r){if(r){var t=r.querySelector(".k-track-container");function n(e){var r=e.currentTarget;if(r.classList.contains("k-slide-visible")){var n=Array.from(t.querySelectorAll(".k-slide-visible")),o=n.indexOf(r),a=0===o,i=o===n.length-1,s=["stepBack"];a?s.push("firstFocused"):i&&s.push("lastFocused"),s.forEach(function(e){return t.classList.add(e)})}}function o(e){e.currentTarget.contains(e.relatedTarget)||["stepBack","firstFocused","lastFocused"].forEach(function(e){return t.classList.remove(e)})}r.querySelectorAll(".k-slide").forEach(function(r){var t=document.createElement("div");t.classList.add("lens-wrapper"),t.append.apply(t,e(r.childNodes)),r.appendChild(t),r.addEventListener("mouseenter",n),r.addEventListener("mouseout",o)})}}require("./index.scss"),window.addEventListener("load",function(){document.querySelectorAll(".lens").forEach(i)});
},{"./index.scss":"dRSj"}]},{},["uS2Q"], null)
//# sourceMappingURL=hover_lens.74a6a25c.js.map