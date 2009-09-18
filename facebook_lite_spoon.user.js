// ==UserScript==
// @name          Facebook Lite Spoon
// @namespace     http://userscripts.org/scripts/show/57854
// @description	  Removes the right-hand bar from Facebook Lite, expanding the content to 60% width. Removes Facebook | from the title and makes the header fixed at the top. Thumbnail previewer.
// @include       http://lite.facebook.com/*
// @include       https://lite.facebook.com/*
// @author		  Marcus Carlsson
// @version		  0.3
// ==/UserScript==

(function () {

//
// Fixes the width of the page and removes the right-hand bar, also set comments to 100% width
//
addStyle("#navigation, #content, #footer {width: 60%; min-width: 900px;} .feedbackView { width: 100%; }");

//
// Top Bar Positioning
//
var contentPosition = getPosition($('content'));
addStyle(' #header { position:fixed !important; width:100% !important; z-index:12; margin-top:0; } '+
'#content { padding-top:' + contentPosition[1] + 'px; }');


//
// Check if we're on the main page, then hide the ads
//
if ($$('muffin', $$('splitViewRightInner')[0])[0]) {
	addStyle(".splitViewRight {display: none;}");
}

//
// Viewing photos, set the comments to 100% width and check for browser-resize
//
function photoComments() {
	var size = ($('contentWrapper').offsetWidth - $$('splitViewContent')[0].offsetWidth - 80);
	addStyle(".phideoView .splitViewRight {width: "+size+"px;} .phideoView .feedbackView {width: 100%;}");
}
photoComments();
window.addEventListener('resize', photoComments, false);

//
// Creates a box where the original image is shown when hovering profile thumbnails
//
function showHover() {
	if (!$('FLSpopup')) {
		var FLSpopup = document.createElement('div');
		FLSpopup.id = 'FLSpopup';
		addStyle("#FLSpopup { background: #ffffff; position: fixed !important; top: 20px; right: 20px; z-index: 20; border: 1px solid #333333; padding: 5px; display: none; }");
		document.body.appendChild(FLSpopup);
	}
	var image = document.createElement('img');
	image.src = this.src.replace(/\/[aqst]([\d_]+)\.jpg/, "/n$1.jpg").replace(/\/([\d_]+)[aqst]\.jpg/, "/$1n.jpg");
	$('FLSpopup').innerHTML = '';
	$('FLSpopup').appendChild(image);
	$('FLSpopup').style.display = 'block';
}

function hideHover() {
	$('FLSpopup').style.display = '';
}

//
// Add mouse-events
//
function mouseEvents() {
	if (document.getElementsByTagName('body')[0].getAttribute('class').match('home')) {
		var profilephoto = $$('profilePhoto');
		for (i in profilephoto) {
			profilephoto[i].childNodes[0].addEventListener('mouseover', showHover, false);
			profilephoto[i].childNodes[0].addEventListener('mouseout', hideHover, false);
		}
		// Add for attachments
		var attachments = $$('attachmentMedia');
		for (i in attachments) {
			var nodes = attachments[i].childNodes;
			for (n in nodes) {
				nodes[n].childNodes[0].addEventListener('mouseover', showHover, false);
				nodes[n].childNodes[0].addEventListener('mouseout', hideHover, false);
			}
		}			
	}

	// Add for photogallery
	if (document.getElementsByTagName('body')[0].getAttribute('class').match('photoList')) {
		var galleryimg = document.getElementsByTagName('td');
		for (i in galleryimg) {
			var nodes = galleryimg[i].childNodes;
			for (n in nodes) {
				nodes[n].childNodes[0].addEventListener('mouseover', showHover, false);
				nodes[n].childNodes[0].addEventListener('mouseout', hideHover, false);
			}
		}
	}
}
mouseEvents();
// Reload mouse events if the content change
$('contentWrapper').addEventListener('DOMNodeInserted', mouseEvents, false);

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
// Get element(s) by class name
//
function $$(className,root){
	if (document.getElementsByClassName) {
		return root ? root.getElementsByClassName(className) : document.getElementsByClassName(className);
	} else {
		var elms = $x('//*[contains(@class,"'+className+'")]',root);
		var buffer = new Array();
		for (var i=0; i<elms.snapshotLength; i++) { buffer.push(elms.snapshotItem(i)); }
		return buffer;
	}
}

//
// XPath
//
function $x(xpath,root){return document.evaluate(xpath,(root?root:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

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
