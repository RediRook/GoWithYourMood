window.onload = function() {
  initializePage();
};

/*
 * checks to make sure the user is logged in.
 * if not logged in alert the user and redirect to
 * index page
 */
function initializePage()
{
    var id = sessionStorage.getItem("userID");
    if(id !== "null")
    {
        getUserInfo(id);
        getReviews(id);
    }
    else
    {
        alert("You are not logged in");
        window.location = "index.html";
    }
}

//$row["name"], $row["review"], $row["date"]
/*
 * accepts the user id from sesssionStorage and retrieves reviews made
 * by this user from the database
 */
function getReviews(varID)
{
    var ajaxRequest = createAJAXRequest();
    var urlString = "GetUserReviews.php?id=" + varID;
    ajaxRequest.open("GET", urlString, true);
    ajaxRequest.send(null);
    
    ajaxRequest.onreadystatechange = function ()
    {console.log(ajaxRequest.readyState);
        if (ajaxRequest.readyState === 4)
        {
            ajaxResult = JSON.parse(ajaxRequest.responseText);
            console.log(ajaxResult);
            
            var reviewDiv = document.getElementById("reviewsDiv");
            var tab = document.createElement("table");
			
            var row1 = document.createElement('tr');
            var th1 = document.createElement('th');
            var th2 = document.createElement('th');
            var th3 = document.createElement('th');
                
            th1.innerHTML = "Location";
            th2.innerHTML = "Reviews";
            th3.innerHTML = "Date";
            
            row1.appendChild(th1);
            row1.appendChild(th2);
            row1.appendChild(th3);
            
            tab.appendChild(row1);
			
            for(var i = 0; i < ajaxResult.length; i++)
            {
                var row = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var td3 = document.createElement("td");
                
                td1.innerHTML = ajaxResult[i][0];
                td2.innerHTML = ajaxResult[i][1];
                td3.innerHTML = ajaxResult[i][2];
                
                row.appendChild(td1);
                row.appendChild(td2);
                row.appendChild(td3);
                
                tab.appendChild(row);
            }
            reviewDiv.appendChild(tab);
        }
    };
}

//{"id":"0","email":"email@email.com","google_id":"1111111111","name":"John Hancock","date_registered":"2016-09-23"}
/*
 * accepts the userid from session storage and uses it to retrieve user information
 */
function getUserInfo(varID)
{
    var ajaxRequest = createAJAXRequest();
    var urlString = "GetUserInfo.php?id=" + varID;
    ajaxRequest.open("GET", urlString, true);
    ajaxRequest.send(null);
    
    ajaxRequest.onreadystatechange = function ()
    {
        if (ajaxRequest.readyState === 4)
        {
            ajaxResult = JSON.parse(ajaxRequest.responseText);
        }
    };
}

//errors to be shown if user location fails
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
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