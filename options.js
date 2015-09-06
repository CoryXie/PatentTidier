// Saves options to chrome.storage.sync.
function save_options() {
    var loadPDF = document.getElementById('loadPDF').checked;
    chrome.storage.sync.set({
        loadPatentPDF: loadPDF
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value loadPatentPDF = true.
    chrome.storage.sync.get({
        loadPatentPDF: true
    }, function(items) {
        document.getElementById('loadPDF').checked = items.loadPatentPDF;
    });
}

function close_window() {
    window.close();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('close').addEventListener('click',
    close_window);