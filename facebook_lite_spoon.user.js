// Copyright (c) 2009, Marcus Carlsson <carlsson.marcus@gmail.com>
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the <organization> nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY Marcus Carlsson ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// 
// ==UserScript==
// @name          Facebook Lite Spoon
// @namespace     http://userscripts.org/scripts/show/57854
// @description	  Removes the right-hand bar from Facebook Lite, expanding the content to 60% width. Removes Facebook | from the title and makes the header fixed at the top. Thumbnail previewer.
// @include       http://lite.facebook.com/*
// @include       https://lite.facebook.com/*
// @author		  Marcus Carlsson
// @version		  0.3.5
// ==/UserScript==

(function () {

//
// Check if we're on the main page, then hide the ads
//
if ($$('LMuffinView', $$('LSplitPage_RightInner')[0])[0]) {
	addStyle(".LSplitPage_Right {display: none;}");
}

//
// Fixes the width of the page and removes the right-hand bar, also set comments to 100% width
//
addStyle("#navigation, #content, #footer {width: 80%; min-width: 900px;} .FN_feedbackview, .UFIView { width: 100%; }");

//
// Top Bar Positioning
//
var contentPosition = getPosition($('content'));
addStyle(' #header { position:fixed !important; width:100% !important; z-index:12; margin-top:0; } '+
'#content { padding-top:' + contentPosition[1] + 'px; }');

//
// Viewing photos, set the comments to 100% width and check for browser-resize
//
function photoComments() {
	var size = ($('contentWrapper').offsetWidth - 625 -80);
    addStyle('.LPhotoListView .LSplitPage_Right {width: '+size+'px;} .LPhotoListView .LSplitPage_Content {width: 605px;} .LPhotoListView .UFIView, .LPhotoListView .LSplitPage_Right .LSplitPage_RightInner {width: 100%}');
}

//
// Creates a box where the original image is shown when hovering profile thumbnails
//
function showHover(e) {
	if (!$('FLSpopup')) {
		var FLSpopup = document.createElement('div');
		FLSpopup.id = 'FLSpopup';
		addStyle("#FLSpopup { background: #ffffff; position: fixed !important; top: 20px; right: 20px; z-index: 20; border: 1px solid #333333; padding: 5px; display: none; }");
		document.body.appendChild(FLSpopup);
	}
	var image = document.createElement('img');
    console.log(this);
    if (this.tagName == 'I')
        image.src = this.style.backgroundImage.replace(/url\(([^)]+)\)/i, '$1').replace(/\/[aqst]([\d_]+)\.jpg/, "/n$1.jpg").replace(/\/([\d_]+)[aqst]\.jpg/, "/$1n.jpg");
    else
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
	if (document.getElementsByTagName('body')[0].getAttribute('class').match('LHomeStreamView') || document.getElementsByTagName('body')[0].getAttribute('class').match('LProfileView')) {
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

	// Add for photogallery as well as setting width for comments to 100% and 50% of #content
	if (document.getElementsByTagName('body')[0].getAttribute('class').match('LPhotoListView') || document.getElementsByTagName('body')[0].getAttribute('class').match('LProfilePhotoPane')) {
        photoComments();
        window.addEventListener('resize', photoComments, false);
        var galleryimg = $$('LGridCropView')[0].getElementsByTagName('td');
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
