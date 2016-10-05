var mapObj;
var suggestion;
var transportMode;
var directionsDisplay;
var directionsService;

window.onload = function() {
  initializePage();
};

function initializePage()
{
    transportMode = 0;
    //suggestion information retrieved from sessionStorage
    suggestion = [sessionStorage.getItem("name"),sessionStorage.getItem("address"),sessionStorage.getItem("suburb"),
                        sessionStorage.getItem("postcode"),sessionStorage.getItem("phone"),sessionStorage.getItem("latitude"),
                            sessionStorage.getItem("longitude"),sessionStorage.getItem("description"),sessionStorage.getItem("rating"),
                                sessionStorage.getItem("serviceId")];

    var backUrl = "suggestions.html?op=" + sessionStorage.getItem("urlOption") + "&ac=" + sessionStorage.getItem("urlActive") +
                    "&so=" + sessionStorage.getItem("urlSocial");
    var backNav = document.getElementById("backId");
    backNav.href = backUrl;
    
    var revLab = document.getElementById("reviewLabel");
    revLab.innerHTML = "What did you think of " + suggestion[0] + "?";
    
    var id = sessionStorage.getItem("userID");

    if(id === "null" || id === null)
    {
        var reviewBtn = document.getElementById("modal_open");
        reviewBtn.style.display = "none";
    }
    else if(id !== "null" || id !== null)
    {
        var reviewMessage = document.getElementById("signInMessage");
        reviewMessage.style.display = "none";
    }
    
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsService = new google.maps.DirectionsService();    
    
    addRating();
    getReviews();
    locationDetail(suggestion);
}

/*
 * selected controls which of the transport buttons has been clicked
 * 
 * 0 = drive
 * 1 = walk
 * 2 = bike
 * 3 = public
 * 
 * Adds the transport icons to the page.
 * Also adds actionListeners to the icons that handle the
 * onclick events.
 */
function addTransportIcons(pos, myCenter)
{    
    var drive = document.getElementById("imgDrive");
    drive.addEventListener("click", function()
    {
        transportMode = 0;
        drive.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        bike.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        plotRoute(pos, myCenter);
    });
    
    var walk = document.getElementById("imgWalk");
    walk.addEventListener("click", function()
    {
        transportMode = 1;
        walk.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        bike.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(pos, myCenter);
    });
    
    var bike = document.getElementById("imgBike");
    bike.addEventListener("click", function()
    {
        transportMode = 2;
        bike.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(pos, myCenter);
    });
    
    var public = document.getElementById("imgPublic");
    public.addEventListener("click", function()
    {
        transportMode = 3;
        public.style.border = "#6495ed solid";
        bike.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(pos, myCenter);
    });
}

/*
 * 
 * Adds the rating stars to the page as well as the sctionalistener 
 * that handles the onlick event. 
 */
function addRating()
{
    var divToHoldRating = document.getElementById("ratingPlace");
    (
    function()
    {
        (function init()
        {
            addRatingWidget(buildShopItem(), suggestion[8]);
        })();

        function buildShopItem()
        {
            var divForRating = document.createElement('div');
            divForRating.id = "ratingDiv";

            var html = '<ul class="c-rating"></ul>';
            divForRating.innerHTML = html;
            divToHoldRating.appendChild(divForRating);
            return divForRating; 
        }

        function addRatingWidget(divForRating, test1) // test1 = holds 		current rating from the database
        {
            var ratingElement = divForRating.querySelector('.c-rating');
            var currentRating = test1;
            var maxRating = 5;
            var callback = function(rating, id)
            {
                saveRating(rating,id,sessionStorage.getItem("userID"));
            };
            var r = rating(ratingElement, currentRating, maxRating, suggestion[9], callback);
        }
    })();
}

   /*
     * 
     * @param {int} rating
     * @param {int} suggestion ID
     * @returns {none}
     * passes the rating and service_id to php to be saved to the database.
     * accepts result as response from the php file for testing purposes only.
     */
function saveRating(rating, id, userId)
{
    var ajaxRequest = createAJAXRequest();
    
    var urlString = "SaveRating.php?rat=" + rating + "&id=" + id + "&userId=" + userId;

    ajaxRequest.open("GET", urlString, true);
    ajaxRequest.send(null);
    
    ajaxRequest.onreadystatechange = function ()
    {
        if (ajaxRequest.readyState === 4)
        {
            //var result = ajaxRequest.responseText;
        }
    };
}

/*
[$row["id"], $row["user_id"], $row["service_id"], $row["review"], $newDate, $row["anonymous"], $row["name"]];
On page load retrieves all reviews associated with this locatino and displays the on the page
*/
function getReviews()
{
    ajaxRequest = createAJAXRequest();
    var urlString = "reviewSuggestion.php?id=" + suggestion[9];
    ajaxRequest.open("GET", urlString, true);
    ajaxRequest.send(null);
    ajaxRequest.onreadystatechange = function ()
    {console.log(ajaxRequest.readyState);
        if (ajaxRequest.readyState === 4)
        {
            ajaxResult = JSON.parse(ajaxRequest.responseText);
            
			
            var tabDiv = document.getElementById("tableReview");
			var tab = document.createElement("table");
            
            var row1 = document.createElement('tr');
                var th1 = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');
                
            th1.innerHTML = "Date";
            th2.innerHTML = "Written by";
            th3.innerHTML = "Review";
            
            row1.appendChild(th1);
            row1.appendChild(th2);
            row1.appendChild(th3);
            
            tab.appendChild(row1);
            
            if(ajaxResult.length > 0)
            {
				console.log(ajaxResult.length);
                for(var i = 0; i < ajaxResult.length; i++)
                {
                    var row2 = document.createElement('tr');
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                        var td3 = document.createElement('td');
                        
                    td1.innerHTML = ajaxResult[i][4];//date
                    if(ajaxResult[i][5] === 0 || ajaxResult[i][5] === "0" )
                    {
                        td2.innerHTML = ajaxResult[i][6];//written by
                    }
                    else
                    {
                        td2.innerHTML = "anonymous";//written by
                    }
                    td3.innerHTML = ajaxResult[i][3];//review
                        
                    row2.appendChild(td1);
                    row2.appendChild(td2);
                    row2.appendChild(td3);
                    
                    tab.appendChild(row2);
                }
		tabDiv.appendChild(tab);
            }
        }
    };
}

/*
 * 
 * suggestion[0] = name
 * suggestion[1] = address
 * suggestion[2] = suburb
 * suggestion[3] = postcode
 * suggestion[4] = phone
 * suggestion[5] = latitude
 * suggestion[6] = longitude
 * suggestion[7] = description
 * suggestion[8] = rating
 * suggestion[9] = database id
 */
function locationDetail()
{
    document.getElementById("suggName").innerHTML = suggestion[0];
    document.getElementById("suggAddress").innerHTML = suggestion[1];
    document.getElementById("suggSuburb").innerHTML = suggestion[2];
    document.getElementById("suggDesc").innerHTML = suggestion[7];
    document.getElementById("suggPost").innerHTML = suggestion[3];
    
    document.getElementById("serviceInput").value = suggestion[9];
    
    getLocation();
}

/*
 * 
 * ACCESS THE GOOGLE DIRECTIONS API AND PLOTS A ROUTE
 * accepts [pos] the location of the destination
 * and [myCenter] the users location
 * transPortMode is a global variable drawn from the html page
 * and set in the action listeners of the transport icons
 */
function plotRoute(pos, myCenter)
{
    var transportModes = ["DRIVING","WALKING","BICYCLING","TRANSIT"];
    directionsDisplay.setMap(mapObj);
    var request = {
        origin: myCenter,
        destination: pos,
        travelMode: transportModes[transportMode]
    };

    directionsService.route(request, function(result,status){
        if(status === 'OK')
        {
            directionsDisplay.setDirections(result);
            directionsDisplay.setPanel(document.getElementById('right-panel'));
        }
    });
    
    addTransportIcons(pos, myCenter);
}

/*
 * Gets location of the user
 */
function getLocation() 
{
    if (navigator.geolocation) 
    {
        options = 
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
         navigator.geolocation.getCurrentPosition(showPosition,showError,options);
    }
    else 
    {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) 
{
    initializeMap(position);
}
    
/*
 * accepts the user position and builds a map 
 */
function initializeMap(position) 
{
    myCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var control = document.getElementById('floating-panel');
    control.style.display = 'block';  
     var mapProp =
            {
                center: myCenter,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
    mapObj = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    //MARKER FOR THE USER LOCATION
    var userImage = 'http://maps.google.com/mapfiles/ms/micons/blue.png';
    var userMarker = new google.maps.Marker({
        position: myCenter,
        icon: userImage
    });
    userMarker.setMap(mapObj);

    //USER INFORMATION WINDOW
    var userString = "You!";
    var infowindow = new google.maps.InfoWindow({
        content: userString
    });
    infowindow.open(mapObj, userMarker);
    
    var lat = parseFloat(suggestion[5]);
    var lng = parseFloat(suggestion[6]);
    var pos = {lat: lat, lng: lng};
    var suggestionMarker = new google.maps.Marker({
        position: pos,
        map:mapObj,
        title:suggestion[0]
    });
    
    plotRoute(pos, myCenter);
}

/*
 * Errors to be displayed if the user location cannot be found
 */
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

/*
 * establishing ajax requests depending on browser
 */
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