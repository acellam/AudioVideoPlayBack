/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery, mxui */
/*mendix */
/*
 AudioVideoPlayback
 ========================
 
 @file      : AudioVideoPlayback.js
 @version   : 3.1.0
 @author    : Andries Smit, Acellam Guy
 @date      : Mon, 23 Nov 2015 17:17:00 GMT
 @copyright : Flock Of Birds
 @license   : Apache 2.0 License
 
 Documentation
 ========================
 Describe your widget here.
 */

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare", "mxui/widget/_WidgetBase", "dijit/_TemplatedMixin",
    "dojo/dom-class", "dojo/dom-style", "dojo/_base/lang", "dojo/html",
    "AudioVideoPlayback/lib/jquery-1.11.2", "dojo/text!AudioVideoPlayback/widget/template/playback.html", "AudioVideoPlayback/lib/jQueryjPlayer/jquery.jplayer.min"
], function (declare, _WidgetBase, _TemplatedMixin, domClass, domStyle, lang, html, _jQuery, widgetTemplate) {
    "use strict";
    var $ = _jQuery.noConflict(true);
    mxui.dom.addCss(require.toUrl("AudioVideoPlayback/widget/ui/blue.monday/jplayer.blue.monday.css"));
    mxui.dom.addCss(require.toUrl("AudioVideoPlayback/widget/ui/playback.css"));

    // Declare widget"s prototype.
    return declare("AudioVideoPlayback.widget.AudioVideoPlayback", [_WidgetBase, _TemplatedMixin], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,
        // Parameters configured in the Modeler.
        autoPlay: false,
        loop: false,
        fullScreen: false,
        videoWidth: 640,
        videoHeigth: 340,
        videoCssClass: "jp-video-360p",
        showUserInterface: true,
        showPlayControl: true,
        showAudiocontrol: true,
        showProgressBar: true,
        showTitle: true,
        showTime: true,
        showToggles: true,
        showFullScreenToggle: true,
        mediaURLattr: "",
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        isPlaying: false,
        isAudio: true,
        jPlayer: null,
        playSource: "mxFile",
        mediaURL: "",
        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },
        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            if (this.mediaURL != "") {
                this.playSource = "widgetUrl";
                this._updateRendering();
            } else if (this.mediaURLattr != "") {
                this.playSource = "widgetAttrUrl";
            }
            //console.log(this.id + ".postCreate "+this.playSource);
        },
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();
            callback();
        },
        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
        },
        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
        },
        // mxui.widget._WidgetBase.resize is called when the page"s layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
        },
        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
            $(this.jpPlayer).jPlayer("destroy");
        },
        getUrl: function () {
            if (this.playSource === "mxFile" && this._contextObj != null) {
                return "file?target=window&guid=" + this._contextObj.getGuid();
            } else if (this.playSource == "widgetAttrUrl" && this._contextObj != null) {
                return this._contextObj.get(this.mediaURLattr);
            } else if (this.playSource == "widgetUrl") {
                return this.mediaURL;
            } else {
                console.log(this.id + ".AudioVideoPlayback No media URL");
                return "";
            }
        },
        // Rerender the interface.
        _updateRendering: function () {
            //destroy if need be (allow shitching, between audio, video or deselecting)
            $(this.jpPlayer).jPlayer("destroy");
            var fileName = this.getUrl();                        
            //console.log(this.id + "._updateRendering "+fileName);
            if (fileName !== "") {
                //file extension
                var ext = fileName.substr(fileName.lastIndexOf(".") + 1);
                domStyle.set(this.jpPlayerUI, "display", "");
                domStyle.set(this.jpPlayer, "display", "");
                this.choosePlayer(fileName, ext);

                this.showHideControlls();
                html.set(this.jpTitle, fileName);
            } else {
                // no context no player
                domStyle.set(this.jpPlayerUI, "display", "none");
                domStyle.set(this.jpPlayer, "display", "none");
            }
        },
        choosePlayer: function (url, ext) {
            if (ext === "mp3" || ext === "wma" || ext === "m4a" || ext === "wav" || ext === "ogg" || ext === "au" || ext === "vox" || ext === "raw") {
                this.isAudio = true;
                this.audio(url);
            } else {
                this.isAudio = false;
                this.video(url);
            }
        },
        audio: function (url) {
            var self = this;
            domClass.remove(this.jpPlayerUI, "jp-video");
            domClass.add(this.jpPlayerUI, "jp-audio");
            $(this.jpPlayer).jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: url
                    });
                    if (self.autoPlay) {
                        $(this).jPlayer("play");
                    }
                },
                cssSelectorAncestor: "#" + this.id,
                loop: this.loop,
                swfPath: "../lib/jQueryjPlayer",
                supplied: "mp3,wav,ogg,wma,ogg,au,vox,raw,m4a"
            });
        },
        video: function (url) {
            var self = this;
            domClass.remove(this.jpPlayerUI, "jp-audio");
            domClass.add(this.jpPlayerUI, "jp-video");
            $(this.jpPlayer).jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        m4v: url
                    });
                    if (self.autoPlay) {
                        $(this).jPlayer("play");
                    }
                },
                cssSelectorAncestor: "#" + this.id,
                fullScreen: this.fullScreen,
                fullWindow: this.fullScreen,
                loop: this.loop,
                swfPath: "../lib/jQueryjPlayer",
                supplied: "m4v,webm,flv,wmv,avi,vob,mp4,mov",
                size: {
                    width: self.videoWidth + "px",
                    height: self.videoHeigth + "px",
                    cssClass: self.videoCssClass
                },
                smoothPlayBar: true,
                keyEnabled: true
            });
        },
        showHideControlls: function () {
            if (!this.showUserInterface) {
                domStyle.set(this.jpPlayerUI, "display", "none");
            }
            if (!this.showPlayControl) {
                domStyle.set(this.jpPlay, "display", "none");
                domStyle.set(this.jpPause, "display", "none");
                domStyle.set(this.jpStop, "display", "none");
            }
            if (!this.showAudiocontrol) {
                domStyle.set(this.jpMute, "display", "none");
                domStyle.set(this.jpUnMute, "display", "none");
                domStyle.set(this.jpMaxValue, "display", "none");
                domStyle.set(this.jpVolume, "display", "none");
            }
            if (!this.showProgressBar) {
                domStyle.set(this.jpProgress, "display", "none");
            }
            if (!this.showTitle) {
                domStyle.set(this.jpTitle, "display", "none");
            }
            if (!this.showTime) {
                domStyle.set(this.jpTimeHolder, "display", "none");
            }
            if (!this.showToggles) {
                domStyle.set(this.jpToggles, "display", "none");
            }
            if (!this.showFullScreenToggle || this.isAudio) {
                domStyle.set(this.jpFullScreen, "display", "none");
                domStyle.set(this.jpRestoreScreen, "display", "none");
            } else if (this.showFullScreenToggle && !this.isAudio) {
                domStyle.set(this.jpFullScreen, "display", "");
                domStyle.set(this.jpRestoreScreen, "display", "");
            }
            if (this.isAudio) {
                domStyle.set(this.jpVideoPlay, "display", "none");
            }
        },
        // Reset subscriptions.
        _resetSubscriptions: function () {
            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(function (handle, i) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }
            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {
                this._handles.push(this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                }));
                if (this.playSource == "widgetAttrUrl") {
                    this._handles.push(this.subscribe({
                        guid: this._contextObj.getGuid(),
                        attr: this.mediaURLattr,
                        callback: lang.hitch(this, function (guid, attr, attrValue) {
                            this._updateRendering();
                        })
                    }));
                }
            }
        }
    });
});
require(["AudioVideoPlayback/widget/AudioVideoPlayback"], function () {
    "use strict";
});