// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'google.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});


chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "libs/jquery-2.1.4.js"});
  chrome.tabs.executeScript(null, {file: "libs/jQueryRotate.js"});
  chrome.tabs.executeScript(null, {file: "libs/jquery.jeditable.js"});
  chrome.tabs.executeScript(null, {file: "libs/FileSaver.js"});
  chrome.tabs.executeScript(null, {file: "libs/jquery.wordexport.js"});
  chrome.tabs.executeScript(null, {file: "content.js"});
});
