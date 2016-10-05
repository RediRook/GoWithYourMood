	 var checkForm = function(e)
  {
    var form = (e.target) ? e.target : e.srcElement;
      if(form.message.value === "") {
      alert("Please enter your valuable feedback in the box below");
      form.message.focus();
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      return;
    }
  };
  
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
  
  // function realted to feedback form ends
	
	
//function to send the feedback to the database
function storeFeedback()
{
    var feedback = document.getElementById("textareaId").value;
    var google_user_Id = sessionStorage.getItem("userID");
    var service_Id = document.getElementById("serviceInput").value;

    var anonymous = 0;
    if(document.getElementById("anonYes").checked === true)//make it anonymous
    {
        anonymous = 1;
    }
    else if(document.getElementById("anonNo").checked === true)//dont make it anonymous
    {
        anonymous = 0;
    }
    
    $.ajax({
        type: 'GET',
        url: 'insertReview.php?',
        data: {
                feedback: feedback,
                userId: google_user_Id,
                serviceId: service_Id,
                anon: anonymous
              },
        success: function( data ) {
        }
    });
}

function createAJAXRequest()
{
    var ajaxRequest;
            try {
        // Opera 8.0+, Firefox, Safari
        ajaxRequest = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer Browsers
        try {
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                // Something went wrong
                alert("Your browser broke!");
                return false;
            }
        }
    }
    return ajaxRequest;
}

/*
 * 
        //var feedback = "this is another test feedback";
        /*$.ajax({
            type: 'POST',
            url: 'insertReview.php?',
            data: {
                    feedback: feedback,
                    userId: google_user_Id,
                    serviceId: service_Id,
                    anon: anonymous
                  },
            success: function( data ) {
                console.log( data );
                alert(data);
            }
        });
    }*/
 