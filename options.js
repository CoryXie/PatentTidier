// Saves options to chrome.storage.sync.
function save_options() {
    var loadPDF = document.getElementById('loadPDF').checked;
    var editDesc = document.getElementById('editDesc').checked;
    chrome.storage.sync.set({
        loadPatentPDF: loadPDF,
        editPatentDesc: editDesc
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
    // Use default value loadPatentPDF = false, editPatentDesc = true.
    chrome.storage.sync.get({
        loadPatentPDF: false,
        editPatentDesc: true
    }, function(items) {
        document.getElementById('loadPDF').checked = items.loadPatentPDF;
        document.getElementById('editDesc').checked = items.editPatentDesc;
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