  
    var modal_init = function() {

    var modalWrapper = document.getElementById("modal_wrapper");
    var modalWindow  = document.getElementById("modal_window");

    var openModal = function(e)
    {
      modalWrapper.className = "overlay";
      var overflow = modalWindow.offsetHeight - document.documentElement.clientHeight;
      if(overflow > 0) {
        modalWindow.style.maxHeight = (parseInt(window.getComputedStyle(modalWindow).height) - overflow) + "px";
      }
      modalWindow.style.marginTop = (-modalWindow.offsetHeight)/2 + "px";
      modalWindow.style.marginLeft = (-modalWindow.offsetWidth)/2 + "px";
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    };

    var closeModal = function(e)
    {
      modalWrapper.className = "";
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    };

    var clickHandler = function(e) {
      if(!e.target) e.target = e.srcElement;
      if(e.target.tagName === "DIV") {
        if(e.target.id !== "modal_window") closeModal(e);
      }
    };

    var keyHandler = function(e) {
      if(e.keyCode === 27) closeModal(e);
    };

    if(document.addEventListener) {
      document.getElementById("modal_open").addEventListener("click", openModal, false);
      document.getElementById("modal_close").addEventListener("click", closeModal, false);
      document.addEventListener("click", clickHandler, false);
      document.addEventListener("keydown", keyHandler, false);
    } else {
      document.getElementById("modal_open").attachEvent("onclick", openModal);
      document.getElementById("modal_close").attachEvent("onclick", closeModal);
      document.attachEvent("onclick", clickHandler);
      document.attachEvent("onkeydown", keyHandler);
    }

  };
window.onload = function() {
  initializePage();
};

function initializePage()
{
    sessionStorage.userID = "null";
}	
	
	//---------------------------------code from aashu------------------------------
    //this function displays the statistics of sad users
    // created by aashu
    function switchVisibleStatistics(emotionInteger) {
        switch (emotionInteger) {
            case 1:
		document.getElementById('anxiousDisplay').style.display = 'block';
		document.getElementById('sadDisplay').style.display = 'none';
                document.getElementById('isolatedDisplay').style.display = 'none';
                document.getElementById('unsafeDisplay').style.display = 'none';
                break;
            case 2:
		document.getElementById('anxiousDisplay').style.display = 'none';
                document.getElementById('sadDisplay').style.display = 'block';
                document.getElementById('isolatedDisplay').style.display = 'none';
                document.getElementById('unsafeDisplay').style.display = 'none';
                break;
            case 3:
		document.getElementById('anxiousDisplay').style.display = 'none';
                document.getElementById('sadDisplay').style.display = 'none';
                document.getElementById('isolatedDisplay').style.display = 'block';
                document.getElementById('unsafeDisplay').style.display = 'none';
                break;
            case 4:
		document.getElementById('anxiousDisplay').style.display = 'none';
                document.getElementById('sadDisplay').style.display = 'none';
                document.getElementById('isolatedDisplay').style.display = 'none';
                document.getElementById('unsafeDisplay').style.display = 'block';
                break;
        }
    }
//---------------------------------code from aashu------------------------------

//five star rating 
//From Nansen

//End of five start rating
