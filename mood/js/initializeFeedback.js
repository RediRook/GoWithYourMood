
//initialises the modal related to the feedbback form
	
if(document.addEventListener) {
    document.getElementById("modal_feedback").addEventListener("submit", checkForm, false);
    document.addEventListener("DOMContentLoaded", modal_init, false);
  } else {
    document.getElementById("modal_feedback").attachEvent("onsubmit", checkForm);
    window.attachEvent("onload", modal_init);
  }
