/**
 * background.js
 * This script runs in the background of the extension and manages the video playback functionality.
 */

// Define a variable to store the currently selected behavior
let selectedBehavior = 'smartPausing'; // Default behavior

// Function to pause videos in inactive tabs
function pauseVideos(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'pause' });
}

// Function to resume videos in active tabs
function resumeVideos(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'resume' });
}

// Function to handle state updates based on selected behavior
function handleStateUpdate(tabId, state) {
  if (selectedBehavior === 'playOneAtATime') {
    if (state === 'resumed') {
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
          if (tab.id !== tabId) {
            pauseVideos(tab.id);
          }
        });
      });
    }
  }
}

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Listener for tab activation
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { action: (tab.id === activeInfo.tabId) ? 'resume' : 'pause' });
    });
  });
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateState') {
    handleStateUpdate(sender.tab.id, request.state);
  } else if (request.action === 'changeBehavior') {
    // Update the selected behavior based on user selection
    selectedBehavior = request.behavior;
    // Save the selected behavior to Chrome storage for persistence
    chrome.storage.local.set({ selectedBehavior: selectedBehavior });
  }
});
