/*jslint white:true, nomen: true, plusplus: true */
/*global require, dojo */
/*mendix */
/*
 AudioVideoPlayback
 ========================
 
 @file      : AudioVideoPlaybackURL.js
 @version   : 3.1
 @author    : Acellam Guy
 @date      : Mon, 23 Nov 2015 17:17:00 GMT
 @copyright : Flock Of Birds
 @license   : Apache 2.0 License
 
 Documentation
 ========================
 Describe your widget here.
 */

dojo.require("AudioVideoPlayback.widget.AudioVideoPlayback");

require(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("AudioVideoPlayback.widget.AudioVideoPlaybackURL", [AudioVideoPlayback.widget.AudioVideoPlayback], {});
});