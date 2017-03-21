/*jslint white:true, nomen: true, plusplus: true */
/*global require,dojo */
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

define([
    "dojo/_base/declare",
    "AudioVideoPlayback/widget/AudioVideoPlayback"
    ], function (declare, AudioVideoPlayback) {
        "use strict";
        return declare("AudioVideoPlayback.widget.AudioVideoPlaybackRemoteFile", [AudioVideoPlayback], {});
    });
require(["AudioVideoPlayback/widget/AudioVideoPlaybackRemoteFile"]);
