/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery */
/*mendix */
/*
    AudioVideoPlayback
    ========================

    @file      : AudioVideoPlayback.js
    @version   : 3.0.0
    @author    : Acellam Guy
    @date      : Tue, 16 Jun 2015 10:16:07 GMT
    @copyright : Flock Of Birds
    @license   : MIT

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
    'AudioVideoPlayback/lib/jquery-1.11.2.min', 'dojo/text!AudioVideoPlayback/widget/template/playback.html','AudioVideoPlayback/lib/jQueryjPlayer/jquery.jplayer'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, html, event, _jQuery, widgetTemplate) {
    'use strict';

    var $ = jQuery.noConflict(true);
    
    
    mxui.dom.addCss(dojo.moduleUrl("AudioVideoPlayback", "widget/ui/blue.monday/jplayer.blue.monday.css"));
    mxui.dom.addCss(dojo.moduleUrl("AudioVideoPlayback", "widget/ui/playback.css"));
    
    // Declare widget's prototype.
    return declare('AudioVideoPlayback.widget.AudioVideoPlayback', [_WidgetBase, _TemplatedMixin], {

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

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        
         isPlaying: false,
         isAudio: true,
         jPlayer: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },
        applyContext: function (context, callback) {
            //destroy if need be (allow shitching, between audio, video or deselecting)
            $(this.jpPlayer).jPlayer( "destroy" );

            if (context.trackObject) {
                // file name
                var fileName = context.trackObject.get("Name");
                //file extension
                var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
                domStyle.set(this.jpPlayerUI, "display", "");  
                domStyle.set(this.jpPlayer, "display", "");  
                
                console.info("Extension is:"+ext);
                
                this.choosePlayer(context, ext);

                this.showHideControlls();
                html.set(this.jpTitle,fileName);
            }else {
                // no context no player
                domStyle.set(this.jpPlayerUI, "display", "none"); 
                domStyle.set(this.jpPlayer, "display", "none");   
            }
            callback && callback();
        },
        choosePlayer: function (context, ext) {
            if (ext === "mp3" || ext === "wma" || ext === "m4a"  || ext === "wav"|| ext === "ogg"|| ext === "au"|| ext === "vox"|| ext === "raw"){
                this.isAudio = true;
                this.audio(context);
            } else {
                this.isAudio = false;
                this.video(context);
            }
        },
        audio: function (context) {
            
           console.info("file guid:"+context.trackId);
            
            var self = this;
            dojo.removeClass(this.jpPlayerUI, "jp-video");
            dojo.addClass(this.jpPlayerUI, "jp-audio");
            $(this.jpPlayer).jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: 'file?target=window&guid=' + context.trackId     
                    });
                    if (self.autoPlay) {
                        $(this).jPlayer("play");
                    }
                },
                cssSelectorAncestor: "#"+ this.id,
                loop: this.loop,
                swfPath: "../lib/jQueryjPlayer",
               supplied: "mp3,wav,ogg,wma,ogg,au,vox,raw,m4a"
            });
        },
        video: function (context) {
            var self = this;
            
             console.info("file guid:"+context.trackId);
            
            dojo.removeClass(this.jpPlayerUI, "jp-audio");
            dojo.addClass(this.jpPlayerUI, "jp-video");        
            $(this.jpPlayer).jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        m4v: 'file?target=window&guid=' + context.trackId
                    });
                    if (self.autoPlay) {
                        $(this).jPlayer("play");
                    }
                },
                cssSelectorAncestor: "#"+ this.id,
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
            if(!this.showUserInterface){
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
            } else if (this.showFullScreenToggle && ! this.isAudio){
                domStyle.set(this.jpFullScreen, "display", "");
                domStyle.set(this.jpRestoreScreen, "display", "");            
            }
            if(this.isAudio) {
                domStyle.set(this.jpVideoPlay, "display", "none");            
            }
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');           
            
            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {},

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {},

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {},

        suspended: function (context) {
            $(this.jpPlayer).jPlayer("stop");
        },
        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            if (typeof document.ontouchstart !== 'undefined') {
                event.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {

            

        },

        // Rerender the interface.
        _updateRendering: function () {


            if (this._contextObj !== null) {
            } else {
            }

            // Important to clear all validations!
            this._clearValidations();
        },

        // Handle validations.
        _handleValidation: function (_validations) {
            this._clearValidations();

            var _validation = _validations[0],
                _message = _validation.getReasonByAttribute(this.backgroundColor);

            if (this.readOnly) {
                _validation.removeAttribute(this.backgroundColor);
            } else {
                if (_message) {
                    this._addValidation(_message);
                    _validation.removeAttribute(this.backgroundColor);
                }
            }
        },

        // Clear validations.
        _clearValidations: function () {
            domConstruct.destroy(this._alertdiv);
            this._alertdiv = null;
        },

        // Show an error message.
        _showError: function (message) {
            if (this._alertDiv !== null) {
                html.set(this._alertDiv, message);
                return true;
            }
            this._alertDiv = domConstruct.create("div", {
                'class': 'alert alert-danger',
                'innerHTML': message
            });
            domConstruct.place(this.domNode, this._alertdiv);
        },

        // Add a validation.
        _addValidation: function (message) {
            this._showError(message);
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            var _objectHandle = null,
                _attrHandle = null,
                _validationHandle = null;

            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(function (handle, i) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {

                _objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });

                _attrHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.backgroundColor,
                    callback: lang.hitch(this, function (guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                _validationHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: lang.hitch(this, this._handleValidation)
                });

                this._handles = [_objectHandle, _attrHandle, _validationHandle];
            }
        }
    });
});
require(['AudioVideoPlayback/widget/AudioVideoPlayback'], function () {
    'use strict';
});