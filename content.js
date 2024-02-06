chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'pause') {
    pauseVideos();
  } else if (request.action === 'resume') {
    resumeVideos();
  }
});

function pauseVideos() {
  const video = document.querySelector('video');
  if (video && !video.paused) {
    video.pause();
    updateTabState('paused');
  }
}

function resumeVideos() {
  const video = document.querySelector('video');
  if (video && video.paused) {
    video.play();
    updateTabState('resumed');
  }
}

function updateTabState(state) {
  chrome.runtime.sendMessage({ action: 'updateState', state });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkAndPause') {
    const video = document.querySelector('video');
    if (video && !video.paused) {
      chrome.runtime.sendMessage({ action: 'setPlayingTabId', tabId: request.currentTabId });
    }
  }
});
