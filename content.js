/**
 * content.js
 * This script runs in the context of web pages and manages video playback based on the background script's commands.
 */

// Function to pause videos
function pauseVideos() {
  const video = document.querySelector('video');
  if (video && !video.paused) {
    video.pause();
    updateTabState('paused');
  }
}

// Function to resume videos
function resumeVideos() {
  const video = document.querySelector('video');
  if (video && video.paused) {
    video.play();
    updateTabState('resumed');
  }
}

// Function to update the state of the tab
function updateTabState(state) {
  chrome.runtime.sendMessage({ action: 'updateState', state });
}

// Message listener to handle play/pause commands
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'pause') {
    pauseVideos();
  } else if (request.action === 'resume') {
    resumeVideos();
  }
});

// Add listener to handle changes in the selected behavior
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'changeBehavior') {
    // Do something if needed when behavior changes
    console.log('Behavior changed to:', request.behavior);
  }
});
