/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery */
/*mendix */
/*
 AudioVideoPlayback
 ========================
 @file      : AudioVideoPlayback.js
 @version   : 3.2.0
 @author    : Andries Smit, Acellam Guy
 @date      : Fri, 17 Mar 2017 09:17:00 GMT
 @copyright : Flock Of Birds
 @license   : Apache 2.0 License
 
 Documentation
 ========================
 Describe your widget here.
 */

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare", 
    "mxui/widget/_WidgetBase", 
    "dijit/_TemplatedMixin", 
    "dojo/text!AudioVideoPlayback/widget/template/Embed.html"
], function (declare, _WidgetBase, _TemplatedMixin, widgetTemplate) {
    "use strict";

    // Declare widget"s prototype.
    return declare("AudioVideoPlayback.widget.AudioVideoPlaybackEmbed", [_WidgetBase, _TemplatedMixin], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,
        // Parameters configured in the Modeler.
        videoWidth: 640,
        videoHeigth: 340,
        allowfullscreen: "",
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
        },
        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            //console.log(this.id + ".postCreate");
            this._updateRendering();
        },
        _updateRendering: function () {
            var self = this;
            if (self.showFullScreenToggle)
                this.allowfullscreen = "allowfullscreen";
            this.embed.innerHTML = '<iframe frameborder="0" rel="0" width="' + self.videoWidth + '" height="' + self.videoHeigth + '" src="' + self.mediaURL + '" ' + this.allowfullscreen + '></iframe>';
        },
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }
    });
});
require(["AudioVideoPlayback/widget/AudioVideoPlaybackEmbed"]);