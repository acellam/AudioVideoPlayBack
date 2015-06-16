/*!
 * jPlayer Draggable Seekbar
 * http://wray.pro/
 *
 * Copyright 2013 Sam Wray
 * Released under the MIT license
 * https://github.com/2xAA/jplayer-draggable-seekbar/blob/master/LICENSE
 */

/* Magic touch->mouse function (Not written by me) */
function touchHandler(event) {
	var touch = event.changedTouches[0];

	var simulatedEvent = document.createEvent("MouseEvent");

	simulatedEvent.initMouseEvent({
		touchstart: "mousedown",
		touchmove: "mousemove",
		touchend: "mouseup"
	}[event.type], true, true, window, 1,
		touch.screenX, touch.screenY,
		touch.clientX, touch.clientY, false,
		false, false, false, 0, null
	);

	touch.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

function addListeners() {
	/* Hide Chrome's annoying text-select-on-drag cursor */
	document.onselectstart = function () {
		return false;
	}

	/* Bind touch events to the magical script up there */
	document.getElementById('seekbar').addEventListener("touchstart", touchHandler, true);
	document.getElementById('seekbar').addEventListener("touchmove", touchHandler, true);
	document.getElementById('seekbar').addEventListener("touchend", touchHandler, true);
	document.getElementById('seekbar').addEventListener("touchcancel", touchHandler, true);

	/* Bind mouse events */
	document.getElementById('seekbar').addEventListener('mousedown', mouseDown, false);
	document.getElementById('seekbar').addEventListener('mousedown', divMove, true);
	window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp() {
	window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
	window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
	var div = document.getElementById('playbar'); //Set this to the play bar
	var container = document.getElementById('seekbar'); //Set this to the seek bar

	var offset = parseInt(container.offsetLeft);
	var maxwidth = (container.offsetWidth);

	/* Percentage calc */
	if(e.clientX+offset <= maxwidth+offset*2) {
		div.style.width = (e.clientX-offset)/(maxwidth/100) + '%';
		$("#jplayer").jPlayer("playHead", (e.clientX-offset)/(maxwidth/100));
	}
}

window.onload = addListeners();