// ==UserScript==
// @name          Facebook Lite Spoon
// @namespace     http://userscripts.org/scripts/show/57854
// @description	  Removes the right-hand bar from Facebook Lite, expanding the content to 60% width. Removes Facebook | from the title and makes the header fixed at the top.
// @include       http://lite.facebook.com/*
// @author		  Marcus Carlsson
// @version		  0.1.6
// ==/UserScript==

(function () {

//
// Fixes the width of the page and removes the right-hand bar, also set comments to 100% width
//
addStyle(".splitViewRight {display:none;} #navigation, #content, #footer {width: 60%; min-width: 900px;} .feedbackView { width: 100%; }");

//
// Top Bar Positioning
//
var contentPosition = getPosition($('content'));
addStyle(' #header { position:fixed !important; width:100% !important; z-index:12; margin-top:0; } '+
'#content { padding-top:' + contentPosition[1] + 'px; }');

//
// Remove Facebook from the title
//
var titleValue = document.title;
document.title = titleValue.replace('Facebook | ', '');

//
// Get element by id
//
function $(id,root){return root ? root.getElementById(id) : document.getElementById(id);}

//
// Add style
//
function addStyle(css) {
	if (typeof GM_addStyle !== 'undefined') { return GM_addStyle(css); }
	else if (heads = document.getElementsByTagName('head')) {
		var style = document.createElement('style');
		try { style.innerHTML = css; }
		catch(x) { style.innerText = css; }
		style.type = 'text/css';
		heads[0].appendChild(style);
	}
}

//
// Get an elements position
//
function getPosition(elm) {
	var x=0;
	var y=0;
	while (elm != null) {
		x += elm.offsetLeft;
		y += elm.offsetTop;
		elm = elm.offsetParent;
	}
	return Array(x,y);
}

}) ();
