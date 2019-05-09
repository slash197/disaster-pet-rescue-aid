!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"undefined"!=typeof exports?module.exports=e(require("jquery")):e(window.jQuery)}(function(e){"use strict";var t="dmUploader",n=0,i=1,s=2,o=3,r=4,u={auto:!0,queue:!0,dnd:!0,hookDocument:!0,multiple:!0,url:document.URL,method:"POST",extraData:{},headers:{},dataType:null,fieldName:"file",maxFileSize:0,allowedTypes:"*",extFilter:null,onInit:function(){},onComplete:function(){},onFallbackMode:function(){},onNewFile:function(){},onBeforeUpload:function(){},onUploadProgress:function(){},onUploadSuccess:function(){},onUploadCanceled:function(){},onUploadError:function(){},onUploadComplete:function(){},onFileTypeError:function(){},onFileSizeError:function(){},onFileExtError:function(){},onDragEnter:function(){},onDragLeave:function(){},onDocumentDragEnter:function(){},onDocumentDragLeave:function(){}},a=function(e,t){this.data=e,this.widget=t,this.jqXHR=null,this.status=n,this.id=Math.random().toString(36).substr(2)};a.prototype.upload=function(){var t=this;if(!t.canUpload())return t.widget.queueRunning&&t.status!==i&&t.widget.processQueue(),!1;var n=new FormData;n.append(t.widget.settings.fieldName,t.data);var s=t.widget.settings.extraData;return"function"==typeof s&&(s=s.call(t.widget.element,t.id)),e.each(s,function(e,t){n.append(e,t)}),t.status=i,t.widget.activeFiles++,t.widget.settings.onBeforeUpload.call(t.widget.element,t.id),t.jqXHR=e.ajax({url:t.widget.settings.url,type:t.widget.settings.method,dataType:t.widget.settings.dataType,data:n,headers:t.widget.settings.headers,cache:!1,contentType:!1,processData:!1,forceSync:!1,xhr:function(){return t.getXhr()},success:function(e){t.onSuccess(e)},error:function(e,n,i){t.onError(e,n,i)},complete:function(){t.onComplete()}}),!0},a.prototype.onSuccess=function(e){this.status=s,this.widget.settings.onUploadSuccess.call(this.widget.element,this.id,e)},a.prototype.onError=function(e,t,n){this.status!==r&&(this.status=o,this.widget.settings.onUploadError.call(this.widget.element,this.id,e,t,n))},a.prototype.onComplete=function(){this.widget.activeFiles--,this.status!==r&&this.widget.settings.onUploadComplete.call(this.widget.element,this.id),this.widget.queueRunning?this.widget.processQueue():this.widget.settings.queue&&0===this.widget.activeFiles&&this.widget.settings.onComplete.call(this.element)},a.prototype.getXhr=function(){var t=this,n=e.ajaxSettings.xhr();return n.upload&&n.upload.addEventListener("progress",function(e){var n=0,i=e.loaded||e.position,s=e.total||e.totalSize;e.lengthComputable&&(n=Math.ceil(i/s*100)),t.widget.settings.onUploadProgress.call(t.widget.element,t.id,n)},!1),n},a.prototype.cancel=function(e){e=void 0!==e&&e;var t=this.status;return!!(t===i||e&&t===n)&&(this.status=r,this.widget.settings.onUploadCanceled.call(this.widget.element,this.id),t===i&&this.jqXHR.abort(),!0)},a.prototype.canUpload=function(){return this.status===n||this.status===o};var l=function(t,n){return this.element=e(t),this.settings=e.extend({},u,n),this.checkSupport()?(this.init(),this):(e.error("Browser not supported by jQuery.dmUploader"),this.settings.onFallbackMode.call(this.element),!1)};l.prototype.checkSupport=function(){if(void 0===window.FormData)return!1;return!new RegExp("/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1.0|2.0|2.5|3.0))/").test(window.navigator.userAgent)&&!e('<input type="file" />').prop("disabled")},l.prototype.init=function(){var n=this;this.queue=[],this.queuePos=-1,this.queueRunning=!1,this.activeFiles=0,this.draggingOver=0,this.draggingOverDoc=0;var i=n.element.is("input[type=file]")?n.element:n.element.find("input[type=file]");return i.length>0&&(i.prop("multiple",this.settings.multiple),i.on("change."+t,function(t){var i=t.target&&t.target.files;i&&i.length&&(n.addFiles(i),e(this).val(""))})),this.settings.dnd&&this.initDnD(),0!==i.length||this.settings.dnd?(this.settings.onInit.call(this.element),this):(e.error("Markup error found by jQuery.dmUploader"),null)},l.prototype.initDnD=function(){var n=this;n.element.on("drop."+t,function(e){e.preventDefault(),n.draggingOver>0&&(n.draggingOver=0,n.settings.onDragLeave.call(n.element));var t=e.originalEvent&&e.originalEvent.dataTransfer;if(t&&t.files&&t.files.length){var i=[];n.settings.multiple?i=t.files:i.push(t.files[0]),n.addFiles(i)}}),n.element.on("dragenter."+t,function(e){e.preventDefault(),0===n.draggingOver&&n.settings.onDragEnter.call(n.element),n.draggingOver++}),n.element.on("dragleave."+t,function(e){e.preventDefault(),n.draggingOver--,0===n.draggingOver&&n.settings.onDragLeave.call(n.element)}),n.settings.hookDocument&&(e(document).off("drop."+t).on("drop."+t,function(e){e.preventDefault(),n.draggingOverDoc>0&&(n.draggingOverDoc=0,n.settings.onDocumentDragLeave.call(n.element))}),e(document).off("dragenter."+t).on("dragenter."+t,function(e){e.preventDefault(),0===n.draggingOverDoc&&n.settings.onDocumentDragEnter.call(n.element),n.draggingOverDoc++}),e(document).off("dragleave."+t).on("dragleave."+t,function(e){e.preventDefault(),n.draggingOverDoc--,0===n.draggingOverDoc&&n.settings.onDocumentDragLeave.call(n.element)}),e(document).off("dragover."+t).on("dragover."+t,function(e){e.preventDefault()}))},l.prototype.releaseEvents=function(){this.element.off("."+t),this.element.find("input[type=file]").off("."+t),this.settings.hookDocument&&e(document).off("."+t)},l.prototype.validateFile=function(t){if(this.settings.maxFileSize>0&&t.size>this.settings.maxFileSize)return this.settings.onFileSizeError.call(this.element,t),!1;if("*"!==this.settings.allowedTypes&&!t.type.match(this.settings.allowedTypes))return this.settings.onFileTypeError.call(this.element,t),!1;if(null!==this.settings.extFilter){var n=t.name.toLowerCase().split(".").pop();if(e.inArray(n,this.settings.extFilter)<0)return this.settings.onFileExtError.call(this.element,t),!1}return new a(t,this)},l.prototype.addFiles=function(e){for(var t=0,n=0;n<e.length;n++){var i=this.validateFile(e[n]);if(i){!1!==this.settings.onNewFile.call(this.element,i.id,i.data)&&(this.settings.auto&&!this.settings.queue&&i.upload(),this.queue.push(i),t++)}}return 0===t?this:(this.settings.auto&&this.settings.queue&&!this.queueRunning&&this.processQueue(),this)},l.prototype.processQueue=function(){return this.queuePos++,this.queuePos>=this.queue.length?(0===this.activeFiles&&this.settings.onComplete.call(this.element),this.queuePos=this.queue.length-1,this.queueRunning=!1,!1):(this.queueRunning=!0,this.queue[this.queuePos].upload())},l.prototype.restartQueue=function(){this.queuePos=-1,this.queueRunning=!1,this.processQueue()},l.prototype.findById=function(e){for(var t=!1,n=0;n<this.queue.length;n++)if(this.queue[n].id===e){t=this.queue[n];break}return t},l.prototype.cancelAll=function(){var e=this.queueRunning;this.queueRunning=!1;for(var t=0;t<this.queue.length;t++)this.queue[t].cancel();e&&this.settings.onComplete.call(this.element)},l.prototype.startAll=function(){if(this.settings.queue)this.restartQueue();else for(var e=0;e<this.queue.length;e++)this.queue[e].upload()},l.prototype.methods={start:function(t){if(this.queueRunning)return!1;var i=!1;return void 0===t||(i=this.findById(t))?i?(i.status===r&&(i.status=n),i.upload()):(this.startAll(),!0):(e.error("File not found in jQuery.dmUploader"),!1)},cancel:function(t){var n=!1;return void 0===t||(n=this.findById(t))?n?n.cancel(!0):(this.cancelAll(),!0):(e.error("File not found in jQuery.dmUploader"),!1)},reset:function(){return this.cancelAll(),this.queue=[],this.queuePos=-1,this.activeFiles=0,!0},destroy:function(){this.cancelAll(),this.releaseEvents(),this.element.removeData(t)}},e.fn.dmUploader=function(n){var i=arguments;if("string"!=typeof n)return this.each(function(){e.data(this,t)||e.data(this,t,new l(this,n))});this.each(function(){var s=e.data(this,t);s instanceof l?"function"==typeof s.methods[n]?s.methods[n].apply(s,Array.prototype.slice.call(i,1)):e.error("Method "+n+" does not exist in jQuery.dmUploader"):e.error("Unknown plugin data found by jQuery.dmUploader")})}});