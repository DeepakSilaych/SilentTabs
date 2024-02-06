// Function to handle the change in behavior selection
function handleBehaviorChange() {
  const selectElement = document.getElementById('toggleBehavior');
  const selectedBehavior = selectElement.value;

  // Send message to background script with selected behavior
  chrome.runtime.sendMessage({ action: 'changeBehavior', behavior: selectedBehavior });
  
  // Save the selected behavior to Chrome storage for persistence
  chrome.storage.local.set({ selectedBehavior: selectedBehavior });
}

// Add event listener for behavior change
document.addEventListener('DOMContentLoaded', function() {
  const selectElement = document.getElementById('toggleBehavior');

  // Retrieve the currently saved behavior setting
  chrome.storage.local.get('selectedBehavior', function(result) {
    const savedBehavior = result.selectedBehavior;

    // Set the selected behavior to the saved behavior, if available
    if (savedBehavior) {
      selectElement.value = savedBehavior;
      
      // Notify background script of the selected behavior
      chrome.runtime.sendMessage({ action: 'changeBehavior', behavior: savedBehavior });
    }
  });

  // Add event listener for behavior change
  selectElement.addEventListener('change', handleBehaviorChange);
});
