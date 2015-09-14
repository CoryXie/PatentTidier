function checkEmail(emailAddress) {
  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

  var reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
}

// Saves options to chrome.storage.sync.
function save_options() {
    var loadPDF = document.getElementById('loadPDF').checked;
    var editDesc = document.getElementById('editDesc').checked;
    var sendEmail = document.getElementById('sendEmail').checked;
    var emailAddr = document.getElementById('emailAddr').value;
    if (sendEmail === true && checkEmail(emailAddr) === false) {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Email Address Invalid.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
        return;
    }
    chrome.storage.sync.set({
        loadPatentPDF: loadPDF,
        editPatentDesc: editDesc,
        sendPatentEmail: sendEmail,
        sendEmailAddr: emailAddr
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
        editPatentDesc: true,
        sendPatentEmail: false,
        sendEmailAddr: "me@example.com"
    }, function(items) {
        document.getElementById('loadPDF').checked = items.loadPatentPDF;
        document.getElementById('editDesc').checked = items.editPatentDesc;
        document.getElementById('sendEmail').checked = items.sendPatentEmail;
        document.getElementById('emailAddr').value = items.sendEmailAddr;
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