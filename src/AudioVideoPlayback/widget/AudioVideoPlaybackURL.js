define([
    "dojo/_base/declare",
    "AudioVideoPlayback/widget/AudioVideoPlayback"
], function (declare, AudioVideoPlayback) {
    "use strict";
    return declare("AudioVideoPlayback.widget.AudioVideoPlaybackURL", [ AudioVideoPlayback ], {});
});

require([ "AudioVideoPlayback/widget/AudioVideoPlaybackURL" ]);
