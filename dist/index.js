'use strict';var _slicedToArray=function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{!d&&h['return']&&h['return']()}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),_extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var _require=require('path'),resolve=_require.resolve,fs=require('fs'),NormalizeChunksPlugin=function(){function a(b){_classCallCheck(this,a);var c={filename:'normalizeChunks.json',path:resolve(process.cwd(),'build/')};this.options=_extends({},c,b)}return _createClass(a,[{key:'apply',value:function apply(b){var c=this;b.plugin('emit',function(b,d){var e=b.getStats().toJson(),f=e.assetsByChunkName,g=a.createAssetMap(f),h=JSON.stringify(g,null,2);c.writeToFile(h).then(function(){b.assets[c.options.filename]={source:function source(){return h},size:function size(){return h.length}}}).then(d)})}},{key:'writeToFile',value:function writeToFile(a){var b=this;return new Promise(function(c){var d=fs.createWriteStream(b.filename(),{mode:493});d.write(a,'utf-8',c)})}},{key:'filename',value:function(){var a=this.options,b=a.filename,c=a.path;return c+'/'+b}}],[{key:'createAssetMap',value:function createAssetMap(a){var b=function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},b=arguments[1],c=b.split('.'),d=_slicedToArray(c,3),e=d[0],f=d[1],g=d[2];return _extends({},a,_defineProperty({},e+'.'+g,b))};return Object.keys(a).map(function(b){return a[b]}).reduce(function buildLookup(a,c){var d={};return d=Array.isArray(c)?c.reduce(b):b({},c),_extends({},a,d)},{})}}]),a}();module.exports=NormalizeChunksPlugin;