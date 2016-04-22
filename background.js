// listen for our browerAction to be clicked
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    
    // Check if tab is loaded
    if(changeInfo.status === 'complete')
    {
        
        // Inject jQuery
        chrome.tabs.executeScript(tab.ib, {
        	file: 'jquery.min.js'
        });
    
        // Inject custom script
    	chrome.tabs.executeScript(tab.ib, {
    		file: 'inject.js'
    	});
        
    }
    
})