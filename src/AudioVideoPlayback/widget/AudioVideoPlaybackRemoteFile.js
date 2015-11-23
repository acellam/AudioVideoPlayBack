/*jslint white:true, nomen: true, plusplus: true */
/*global require,dojo */
/*mendix */
/*
 AudioVideoPlayback
 ========================
 
 @file      : AudioVideoPlaybackRemoteFile.js
 @version   : 4.3.0
 @author    : Acellam Guy, Andries Smit
 @date      : Tue, 19 Nov 2015 10:16:07 GMT
 @copyright : Flock Of Birds
 @license   : Apache 2.0 License
 
 Documentation
 ========================
 Describe your widget here.
 */

dojo.require("AudioVideoPlayback.widget.AudioVideoPlayback");
require(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("AudioVideoPlayback.widget.AudioVideoPlaybackRemoteFile", [AudioVideoPlayback.widget.AudioVideoPlayback], {});
});