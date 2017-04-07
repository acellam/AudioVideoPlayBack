define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!AudioVideoPlayback/widget/template/Embed.html"
], function (declare, _WidgetBase, _TemplatedMixin, widgetTemplate) {
    "use strict";

    return declare("AudioVideoPlayback.widget.AudioVideoPlaybackEmbed", [ _WidgetBase, _TemplatedMixin ], {
        templateString: widgetTemplate,
        // Parameters configured in the Modeler.
        videoWidth: 640,
        videoHeight: 340,
        allowFullScreen: "",

        constructor: function () {
        },

        postCreate: function () {
            this._updateRendering();
        },

        _updateRendering: function () {
            var self = this;
            if (self.showFullScreenToggle) { this.allowFullScreen = "allowfullscreen"; }
            this.embed.innerHTML = '<iframe frameborder="0" rel="0" width="' + self.videoWidth + '" height="' + self.videoHeight + '" src="' + self.mediaURL + '" ' + this.allowFullScreen + "></iframe>";
        },

        uninitialize: function () {
        }
    });
});

require([ "AudioVideoPlayback/widget/AudioVideoPlaybackEmbed" ]);
