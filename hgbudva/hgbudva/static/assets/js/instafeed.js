/* instafeed.js | v2.0.0-rc2 | https://github.com/stevenschobert/instafeed.js | License: MIT */
!function exportInstafeed(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&"string"!=typeof exports.nodeName?module.exports=t():e.Instafeed=t()}(this,function defineInstafeed(){function n(e,t){if(!e)throw new Error(t)}function e(e){n(!e||"object"==typeof e,"options must be an object, got "+e+" ("+typeof e+")");var t={accessToken:null,accessTokenTimeout:1e4,after:null,apiTimeout:1e4,before:null,debug:!1,error:null,filter:null,limit:null,mock:!1,render:null,sort:null,success:null,target:"instafeed",template:'<a href="{{link}}"><img title="{{caption}}" src="{{image}}" /></a>',templateBoundaries:["{{","}}"],transform:null};if(e)for(var o in t)"undefined"!=typeof e[o]&&(t[o]=e[o]);n("string"==typeof t.target||"object"==typeof t.target,"target must be a string or DOM node, got "+t.target+" ("+typeof t.target+")"),n("string"==typeof t.accessToken||"function"==typeof t.accessToken,"accessToken must be a string or function, got "+t.accessToken+" ("+typeof t.accessToken+")"),n("number"==typeof t.accessTokenTimeout,"accessTokenTimeout must be a number, got "+t.accessTokenTimeout+" ("+typeof t.accessTokenTimeout+")"),n("number"==typeof t.apiTimeout,"apiTimeout must be a number, got "+t.apiTimeout+" ("+typeof t.apiTimeout+")"),n("boolean"==typeof t.debug,"debug must be true or false, got "+t.debug+" ("+typeof t.debug+")"),n("boolean"==typeof t.mock,"mock must be true or false, got "+t.mock+" ("+typeof t.mock+")"),n("object"==typeof t.templateBoundaries&&2===t.templateBoundaries.length&&"string"==typeof t.templateBoundaries[0]&&"string"==typeof t.templateBoundaries[1],"templateBoundaries must be an array of 2 strings, got "+t.templateBoundaries+" ("+typeof t.templateBoundaries+")"),n(!t.template||"string"==typeof t.template,"template must null or string, got "+t.template+" ("+typeof t.template+")"),n(!t.error||"function"==typeof t.error,"error must be null or function, got "+t.error+" ("+typeof t.error+")"),n(!t.before||"function"==typeof t.before,"before must be null or function, got "+t.before+" ("+typeof t.before+")"),n(!t.after||"function"==typeof t.after,"after must be null or function, got "+t.after+" ("+typeof t.after+")"),n(!t.success||"function"==typeof t.success,"success must be null or function, got "+t.success+" ("+typeof t.success+")"),n(!t.filter||"function"==typeof t.filter,"filter must be null or function, got "+t.filter+" ("+typeof t.filter+")"),n(!t.transform||"function"==typeof t.transform,"transform must be null or function, got "+t.transform+" ("+typeof t.transform+")"),n(!t.sort||"function"==typeof t.sort,"sort must be null or function, got "+t.sort+" ("+typeof t.sort+")"),n(!t.render||"function"==typeof t.render,"render must be null or function, got "+t.render+" ("+typeof t.render+")"),n(!t.limit||"number"==typeof t.limit,"limit must be null or number, got "+t.limit+" ("+typeof t.limit+")"),this._state={running:!1},this._options=t}return e.prototype.run=function(){var r=this,s=null,o=null,i=null,a=null;return this._debug("run","options",this._options),this._debug("run","state",this._state),this._state.running?(this._debug("run","already running, skipping"),!1):(this._start(),this._debug("run","getting dom node"),(s="string"==typeof this._options.target?document.getElementById(this._options.target):this._options.target)?(this._debug("run","got dom node",s),this._debug("run","getting access token"),this._getAccessToken(function(e,t){if(e)return r._debug("onTokenReceived","error",e),void r._fail(new Error("error getting access token: "+e.message));o="https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token="+t,r._debug("onTokenReceived","request url",o),r._makeApiRequest(o,function(e,t){if(e)return r._debug("onResponseReceived","error",e),void r._fail(new Error("api request error: "+e.message));r._debug("onResponseReceived","data",t),r._success(t);try{i=r._processData(t),r._debug("onResponseReceived","processed data",i)}catch(o){return void r._fail(o)}if(r._options.mock)r._debug("onResponseReceived","mock enabled, skipping render");else{try{a=r._renderData(i),r._debug("onResponseReceived","html content",a)}catch(n){return void r._fail(n)}s.innerHTML=a}r._finish()})}),!0):(this._fail(new Error("no element found with ID "+this._options.target)),!1))},e.prototype._processData=function(e){var t="function"==typeof this._options.transform,o="function"==typeof this._options.filter,n="function"==typeof this._options.sort,r="number"==typeof this._options.limit,s=[],i=null,a=null,u=null,c=null;if(this._debug("processData","hasFilter",o,"hasTransform",t,"hasSort",n,"hasLimit",r),"object"!=typeof e||"object"!=typeof e.data||e.data.length<=0)return null;for(var l=0;l<e.data.length;l++){if(a=this._getItemData(e.data[l]),t)try{u=this._options.transform(a),this._debug("processData","transformed item",a,u)}catch(p){throw this._debug("processData","error calling transform",p),new Error("error in transform: "+p.message)}else u=a;if(o){try{c=this._options.filter(u),this._debug("processData","filter item result",u,c)}catch(p){throw this._debug("processData","error calling filter",p),new Error("error in filter: "+p.message)}c&&s.push(u)}else s.push(u)}if(n)try{s.sort(this._options.sort)}catch(p){throw this._debug("processData","error calling sort",p),new Error("error in sort: "+p.message)}return r&&(i=s.length-this._options.limit,this._debug("processData","checking limit",s.length,this._options.limit,i),0<i&&s.splice(s.length-i,i)),s},e.prototype._extractTags=function(e){var t=/#([^\s]+)/gi,o=/[~`!@#$%^&*\(\)\-\+={}\[\]:;"'<>\?,\./|\\\s]+/i,n=[];if("string"==typeof e)for(;null!==(match=t.exec(e));)!1===o.test(match[1])&&n.push(match[1]);return n},e.prototype._getItemData=function(e){var t=null,o=null;switch(e.media_type){case"IMAGE":t="image",o=e.media_url;break;case"VIDEO":t="video",o=e.thumbnail_url;break;case"CAROUSEL_ALBUM":t="album",o=e.media_url}return{caption:e.caption,tags:this._extractTags(e.caption),id:e.id,image:o,link:e.permalink,model:e,timestamp:e.timestamp,type:t,username:e.username}},e.prototype._renderData=function(e){var t="string"==typeof this._options.template,o="function"==typeof this._options.render,n=null,r=null,s="";if(this._debug("renderData","hasTemplate",t,"hasRender",o),"object"!=typeof e||e.length<=0)return null;for(var i=0;i<e.length;i++){if(n=e[i],o)try{r=this._options.render(n,this._options),this._debug("renderData","custom render result",n,r)}catch(a){throw this._debug("renderData","error calling render",a),new Error("error in render: "+a.message)}else t&&(r=this._basicRender(n));r?s+=r:this._debug("renderData","render item did not return any content",n)}return s},e.prototype._basicRender=function(e){for(var t=new RegExp(this._options.templateBoundaries[0]+"([\\s\\w.]+)"+this._options.templateBoundaries[1],"gm"),o=this._options.template,n=null,r="",s=0,i=null,a=null;null!==(n=t.exec(o));)i=n[1],r+=o.slice(s,n.index),(a=this._valueForKeyPath(i,e))&&(r+=a.toString()),s=t.lastIndex;return s<o.length&&(r+=o.slice(s,o.length)),r},e.prototype._valueForKeyPath=function(e,t){for(var o=/([\w]+)/gm,n=null,r=t;null!==(n=o.exec(e));){if("object"!=typeof r)return null;r=r[n[1]]}return r},e.prototype._fail=function(e){!this._runHook("error",e)&&console&&"function"==typeof console.error&&console.error(e),this._state.running=!1},e.prototype._start=function(){this._state.running=!0,this._runHook("before")},e.prototype._finish=function(){this._runHook("after"),this._state.running=!1},e.prototype._success=function(e){this._runHook("success",e),this._state.running=!1},e.prototype._makeApiRequest=function(e,o){var n=!1,r=this,s=null,i=function i(e,t){n||(n=!0,o(e,t))};(s=new XMLHttpRequest).ontimeout=function(e){i(new Error("api request timed out"))},s.onerror=function(e){i(new Error("api connection error"))},s.onload=function(e){var t=s.getResponseHeader("Content-Type"),o=null;if(r._debug("apiRequestOnLoad","loaded",e),r._debug("apiRequestOnLoad","response status",s.status),r._debug("apiRequestOnLoad","response content type",t),0<=t.indexOf("application/json"))try{o=JSON.parse(s.responseText)}catch(n){return r._debug("apiRequestOnLoad","json parsing error",n,s.responseText),void i(new Error("error parsing response json"))}200===s.status?i(null,o):o&&o.error?i(new Error(o.error.code+" "+o.error.message)):i(new Error("status code "+s.status))},s.open("GET",e,!0),s.timeout=this._options.apiTimeout,s.send()},e.prototype._getAccessToken=function(o){var n=!1,r=this,s=null,i=function i(e,t){n||(n=!0,clearTimeout(s),o(e,t))};if("function"==typeof this._options.accessToken){this._debug("getAccessToken","calling accessToken as function"),s=setTimeout(function(){r._debug("getAccessToken","timeout check",n),i(new Error("accessToken timed out"),null)},this._options.accessTokenTimeout);try{this._options.accessToken(function(e,t){r._debug("getAccessToken","received accessToken callback",n,e,t),i(e,t)})}catch(e){this._debug("getAccessToken","error invoking the accessToken as function",e),i(e,null)}}else this._debug("getAccessToken","treating accessToken as static",typeof this._options.accessToken),i(null,this._options.accessToken)},e.prototype._debug=function(){var e=null;this._options.debug&&console&&"function"==typeof console.log&&((e=[].slice.call(arguments))[0]="[Instafeed] ["+e[0]+"]",console.log.apply(null,e))},e.prototype._runHook=function(e,t){var o=!1;if("function"==typeof this._options[e])try{this._options[e](t),o=!0}catch(n){this._debug("runHook","error calling hook",e,n)}return o},e});
//# sourceMappingURL=instafeed.min.map