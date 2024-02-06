if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

let currentPlayingTabId = null;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  currentPlayingTabId = activeInfo.tabId;
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if (tab.id !== activeInfo.tabId) {
        chrome.tabs.sendMessage(tab.id, { action: 'checkAndPause', currentTabId: activeInfo.tabId });
      }
    });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'setPlayingTabId') {
    currentPlayingTabId = request.tabId;
  }
});

function pauseVideosInOtherTabs(currentTabId) {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if (tab.id !== currentTabId) {
        chrome.tabs.sendMessage(tab.id, { action: 'pause' });
      }
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'pause') {
    pauseVideos(sender.tab.id);
  } else if (request.action === 'resume') {
    resumeVideos(sender.tab.id);
  } else if (request.action === 'updateState') {
    handleStateUpdate(sender.tab.id, request.state);
  } else if (request.action === 'checkAndPause') {
    const video = document.querySelector('video');
    if (video && !video.paused) {
      chrome.runtime.sendMessage({ action: 'setPlayingTabId', tabId: request.currentTabId });
    }
  }
});

function pauseVideos(tabId) {
  const video = document.querySelector('video');
  if (video && !video.paused) {
    video.pause();
    updateTabState(tabId, 'paused');
    showNotification('Video Paused', `Paused video in tab ${tabId}`);
  }
}

function resumeVideos(tabId) {
  const video = document.querySelector('video');
  if (video && video.paused) {
    video.play();
    updateTabState(tabId, 'resumed');
    showNotification('Video Resumed', `Resumed video in tab ${tabId}`);
  }
}

function updateTabState(tabId, state) {
  chrome.storage.local.get(['tabStates'], function(result) {
    const tabStates = result.tabStates || {};
    tabStates[tabId] = state;
    chrome.storage.local.set({ tabStates: tabStates });
  });
}

function handleStateUpdate(tabId, state) {
  if (state === 'paused') {
    pauseVideos(tabId);
  } else if (state === 'resumed') {
    resumeVideos(tabId);
  }
  console.log(`background.js loaded ${tabId}`);
}

function showNotification(title, message) {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'icon.jpg',
    title: title,
    message: message,
  });
}
