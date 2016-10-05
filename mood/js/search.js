var geocoder;
var numTables;
var mapObj;
var ajaxResult;
var markerNames;
var options;
var directionsDisplay;
var directionsService;
var userPos;
var myCenter;
var markers;
var searchRad;
var numResults;
var transportMode;
var selectedPosition;

google.maps.event.addDomListener(window, "load");

window.onload = function () {
    initializePage();
};

function initializePage()
{
    var urlString = window.location.search.substring(1);
    //1 = anxious, 2 = sad, 3 = isolated, 4 = unsafe, 5 = happy, 6 = celebratory, 7 = energetic
    //1 = yes, 2 = no, 3 = maybe, 4 = unsafe, 5 = safe

    //Takes the data from the url and processes it to be sent to the database
    var optionIndex = urlString.indexOf("op=");
    optionIndex = optionIndex + 3;
    var option = urlString.substring(optionIndex, urlString.indexOf("&ac="));

    var activeIndex = urlString.indexOf("ac=");
    activeIndex = activeIndex + 3;
    var active = urlString.substring(activeIndex, urlString.indexOf("&so="));

    var socialIndex = urlString.indexOf("so=");
    socialIndex = socialIndex + 3;
    var social = urlString.substring(socialIndex, urlString.length);

    //test to display the Emergency Call option
    if (option === 4 && active === 4 && social === 4)
    {
        document.getElementById('emergencyCall').style.display = 'block';
    }
    else
    {
        document.getElementById('emergencyCall').style.display = 'none';
    }

    //test ends

    numTables = 0;
    markerNames = ['assets/img/GoogleMapsMarkers/red_MarkerA.png', 'assets/img/GoogleMapsMarkers/red_MarkerB.png',
        'assets/img/GoogleMapsMarkers/red_MarkerC.png', 'assets/img/GoogleMapsMarkers/red_MarkerD.png',
        'assets/img/GoogleMapsMarkers/red_MarkerE.png', 'assets/img/GoogleMapsMarkers/red_MarkerF.png',
        'assets/img/GoogleMapsMarkers/red_MarkerG.png', 'assets/img/GoogleMapsMarkers/red_MarkerH.png',
        'assets/img/GoogleMapsMarkers/red_MarkerI.png', 'assets/img/GoogleMapsMarkers/red_MarkerJ.png',
        'assets/img/GoogleMapsMarkers/red_MarkerK.png', 'assets/img/GoogleMapsMarkers/red_MarkerL.png',
        'assets/img/GoogleMapsMarkers/red_MarkerM.png', 'assets/img/GoogleMapsMarkers/red_MarkerN.png',
        'assets/img/GoogleMapsMarkers/red_MarkerO.png', 'assets/img/GoogleMapsMarkers/red_MarkerP.png',
        'assets/img/GoogleMapsMarkers/red_MarkerQ.png', 'assets/img/GoogleMapsMarkers/red_MarkerR.png',
        'assets/img/GoogleMapsMarkers/red_MarkerS.png', 'assets/img/GoogleMapsMarkers/red_MarkerT.png',
        'assets/img/GoogleMapsMarkers/red_MarkerU.png', 'assets/img/GoogleMapsMarkers/red_MarkerV.png',
        'assets/img/GoogleMapsMarkers/red_MarkerW.png', 'assets/img/GoogleMapsMarkers/red_MarkerX.png',
        'assets/img/GoogleMapsMarkers/red_MarkerY.png', 'assets/img/GoogleMapsMarkers/red_MarkerZ.png'];

    options =//options for building a map
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsService = new google.maps.DirectionsService();
    //geocoder = new google.maps.Geocoder();

    waitForMarkers = false;
    markers = [];
    searchRad = 5;//initial search radius
    numResults = 5;

//event listener for the show more results button
    document.getElementById("moreResults").addEventListener("click", function ()
    {
        if (numResults < 25)//only have 26 markers so only show up to 25 locations
        {
            searchRad += 0.5;
            numResults += 5;
            search(option, active, social);
        }
        else
        {
            alert("No more results may be displayed");
        }
    });

    addTransportIcons();
    search(option, active, social);
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
function addTransportIcons()
{
    transportMode = 0;
    var drive = document.getElementById("imgDrive");
    drive.addEventListener("click", function ()
    {
        transportMode = 0;
        drive.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        bike.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        plotRoute(selectedPosition, myCenter);
    });

    var walk = document.getElementById("imgWalk");
    walk.addEventListener("click", function ()
    {
        transportMode = 1;
        walk.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        bike.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(selectedPosition, myCenter);
    });

    var bike = document.getElementById("imgBike");
    bike.addEventListener("click", function ()
    {
        transportMode = 2;
        bike.style.border = "#6495ed solid";
        public.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(selectedPosition, myCenter);
    });

    var public = document.getElementById("imgPublic");
    public.addEventListener("click", function ()
    {
        transportMode = 3;
        public.style.border = "#6495ed solid";
        bike.style.border = "#ffffff solid";
        walk.style.border = "#ffffff solid";
        drive.style.border = "#ffffff solid";
        plotRoute(selectedPosition, myCenter);
    });
}

/*
 ajaxResult variable receives and parses a JSON object into a 2 dimensional array
 an example of what a single row returned will look like: 
 [["2","Alexandra","33 GRANT STREET","ALEXANDRA","3714","57721040","-37.18859863281250000000","145.70799255371094000000",
 "","security"]]
 when trying to access elements in the array using a loop, columns are as follows:
 ajaxResult[i][0] = database id
 ajaxResult[i][1] = name
 ajaxResult[i][2] = address
 ajaxResult[i][3] = suburb
 avar ajaxResult;jaxResult[i][4] = postcode
 ajaxResult[i][5] = phone
 ajaxResult[i][6] = latitude
 ajaxResult[i][7] = longitude
 ajaxResult[i][8] = description
 ajaxResult[i][9] = service_type
 ajaxResult[i][10] = rating
 */
function search(option, active, social)
{
    var ajaxRequest = createAJAXRequest();
    removeTable();
    getLocation();

    var geoSuccess = function (position)
    {
        var urlString = buildUrlString(option, position, active, social);

        ajaxRequest.open("GET", urlString, true);
        ajaxRequest.send(null);
    };
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(geoSuccess, showError, options);
    }
    else
    {
        alert("Geolocation is not supported by this browser.");
    }

    // Create a function that will receive data
    // sent from the server and will update
    // div section in the same page.
    ajaxRequest.onreadystatechange = function ()
    {
        if (ajaxRequest.readyState === 4)
        {
            ajaxResult = JSON.parse(ajaxRequest.responseText);
            if (ajaxResult.length > 0)
            {
                sessionStorage.urlOption = option;
                sessionStorage.urlActive = active;
                sessionStorage.urlSocial = social;

                sortByDistance();
                initializeMap();
                buildTable();
            }
            else if (ajaxResult === 0 && searchRad < 10)
            {
                searchRad += 0.5;
                search(option, active, social);
            }
            else
            {
                alert("Nothing found for your area");
                //window.location = "index.html";
            }
        }
    };

    if (searchRad === 1)
    {
        var emo;
        switch (option)//1 = anxious, 2 = sad, 3 = isolated, 4 = unsafe, 5 = happy, 6 = celebratory, 7 = energetic
        {
            case "1":
                emo = "anxious";
                break;
            case "2":
                emo = "sad";
                break;
            case "3":
                emo = "isolated";
                break;
            case "4":
                emo = "afraid"
                break;
            case "5":
                emo = "happy";
                break;
            case "6":
                emo = "celebratory";
                break;
            case "7":
                emo = "energetic";
                break;
        }
        var activityRequest = createAJAXRequest();
        var urlString = "activityModel.php?opt=" + emo;

        activityRequest.open("GET", urlString, true);
        activityRequest.send(null);

        // Create a function that will receive data
        // sent from the server and will update
        // div section in the same page.
        activityRequest.onreadystatechange = function ()
        {
            if (activityRequest.readyState === 4)
            {
                activityResult = JSON.parse(activityRequest.responseText);
                if (activityResult.length > 0)
                {
                    var activityDiv = document.getElementById("activityDiv");
                    var tab = document.createElement("table");

                    for (var i = 0; i < activityResult.length; i++)
                    {
                        var row1 = document.createElement("tr");
                        var td1 = document.createElement("td");
                        var row2 = document.createElement("tr");
                        var td2 = document.createElement("td");
                        //var row2Div = document.createElement("div");

                        //row2Div.appendChild(row2);
                        //row2Div.id = "activityBorder";
                        row2.style.borderBottom = "1px solid #b3b3b3";

                        if ((i % 2) === 0)
                        {
                            row2.style.backgroundColor = "#fafafa";
                            row1.style.backgroundColor = "#fafafa";
                        }
                        td1.innerHTML = activityResult[i][0].bold();
                        td2.innerHTML = activityResult[i][1];

                        row1.appendChild(td1);
                        row2.appendChild(td2);

                        tab.appendChild(row1);
                        tab.appendChild(row2);
                    }
                    activityDiv.appendChild(tab);
                }
            }
        };
    }
}

/*
 * 
 * @param {int} rating
 * @param {int} suggestion ID
 * @returns {none}
 * passes the rating and service_id to php to be saved to the database.
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
            var result = ajaxRequest.responseText;
        }
    };
}

//stores information needed on th location page to the session then redirects
function passToLocation(i)
{
    sessionStorage.name = ajaxResult[i][1];
    sessionStorage.address = ajaxResult[i][2];
    sessionStorage.suburb = ajaxResult[i][3];
    sessionStorage.postcode = ajaxResult[i][4];
    sessionStorage.phone = ajaxResult[i][5];
    sessionStorage.latitude = ajaxResult[i][6];
    sessionStorage.longitude = ajaxResult[i][7];
    sessionStorage.description = ajaxResult[i][8];
    sessionStorage.rating = ajaxResult[i][10];
    sessionStorage.serviceId = ajaxResult[i][0];

    sessionStorage.userPos = myCenter;

    window.location = "location.html";
}

/*
 ajaxResult variable receives and parses a JSON object into a 2 dimensional array
 an example of what a single row returned will look like: 
 [["2","Alexandra","33 GRANT STREET","ALEXANDRA","3714","57721040","-37.18859863281250000000",
 "145.70799255371094000000","","security"]]
 when trying to access elements in the array using a loop, columns are as follows:
 ajaxResult[i][0] = database id
 ajaxResult[i][1] = name
 ajaxResult[i][2] = address
 ajaxResult[i][3] = suburb
 ajaxResult[i][4] = postcode
 ajaxResult[i][5] = phone
 ajaxResult[i][6] = latitude
 ajaxResult[i][7] = longitude
 ajaxResult[i][8] = description
 ajaxResult[i][9] = service_type
 ajaxResult[i][10] = rating
 */
function buildTable()
{
    var returnDiv = document.getElementById("returnDiv");
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
        "U", "V", "W", "X", "W", "Z"];

    for (var i = 0; i < ajaxResult.length; i++)
    {
        //DISPLAY TABLE STRUCTURE
        var element = document.createElement('input');
        element.id = 'modal_open';
        element.type = 'button';
        element.value = 'Feedback';

        var retTab = document.createElement('table');
        retTab.id = "retTab";
        var row1 = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

//EVENT LISTENERS REDIRECT TO LOCATION PAGE TO DISPLAY DETAILS ABOUT EACH SUGGESTION
        td1.addEventListener("click", (function (i)
        {
            return function ()
            {
                passToLocation(i);
            };
        })(i));

        td2.addEventListener("click", (function (i)
        {
            return function ()
            {
                passToLocation(i);
            };
        })(i));

//RATINGS DISPLAY CODE
        var divToHoldRating = document.createElement("div");
        (
                function ()
                {
                    (function init()
                    {
                        addRatingWidget(buildShopItem(), ajaxResult[i][10]);
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
                        var callback = function (rating, id)
                        {
                            saveRating(rating, id, sessionStorage.getItem("userID"));
                        };
                        var r = rating(ratingElement, currentRating, maxRating, ajaxResult[i][0], callback);
                    }
                })();
        var element = document.createElement('input');
        element.id = 'modal_open';
        element.type = 'button';
        element.value = 'Feedback';
        //END RATINGS CODE       

        td1.innerHTML = "<b>" + letters[i] + "</b>";

        td2.innerHTML = ajaxResult[i][1]; //get name

        td3.className = "ratingTD";
        td3.appendChild(divToHoldRating);

        row1.appendChild(td1);
        row1.appendChild(td2);
        row1.appendChild(td3);
        if ((i % 2) === 0)
        {
            row1.style.backgroundColor = "#fafafa";
        }

        retTab.appendChild(row1);
        returnDiv.appendChild(retTab);
        numTables++;
    }
}

/*
 * 
 * @param {string} option - used to determine which emotion has been selcted
 * @param {geoposition} position - passed to php to be used to determine bounding box
 * @param {string} active
 * @param {string} social
 *  returns url string for sending data to a php file
 */
function buildUrlString(option, position, active, social)//1 = active/social, 2 = not, 3 = somewhat, 4 = unsafe, 5 = safe
{
    var actString;
    var socString;
    var urlString;
    /*
     1 = anxious
     2 = sad
     3 = isolated
     4 = unsafe
     */
    switch (option)
    {
        case "1":
            urlString = "anxiousModel.php";
            break;
        case "2":
            urlString = "sadModel.php";
            break;
        case "3":
            urlString = "isolatedModel.php";
            break;
        case "4":
            urlString = "securityModel.php";
            break;
        case "5":
            urlString = "happyModel.php";
            break;
        case "6":
            urlString = "celebratoryModel.php";
            break;
        case "7":
            urlString = "EnergeticModel.php";
            break;
    }

    switch (active)
    {
        case "1":
            actString = "active";
            break;
        case "2":
            actString = "not";
            break;
    }

    switch (social)
    {
        case "1":
            socString = "social";
            break;
        case "2":
            socString = "not";
            break;
    }

    urlString += "?lat=" + position.coords.latitude + "&long=" + position.coords.longitude +
            "&act=" + actString + "&soc=" + socString + "&rad=" + searchRad + "&numRes=" + numResults;
    return urlString;
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
 * @param {type} option
 * @returns {Boolean}
 * Calculates the distance between each suggestion returned and the user location
 * It then sorts the suggestions from closest to furthest
 */
function sortByDistance()
{
    var distanceList = [];

    for (var i = 0; i < ajaxResult.length; i++)
    {
        var R = 6371000; // Earth’s mean radius in meter
        var dLat = rad(ajaxResult[i][6] - userPos.coords.latitude);
        var dLong = rad(ajaxResult[i][7] - userPos.coords.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(userPos.coords.latitude)) * Math.cos(rad(ajaxResult[i][6])) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distanceList.push(Math.ceil(d));//returns the distance in meters
    }

    var swapped = true;
    do
    {
        swapped = false;
        for (var i = 0; i < distanceList.length - 1; i++)
        {
            if (ajaxResult[i][10] === ajaxResult[i + 1][10])
            {
                if (distanceList[i] > distanceList[i + 1])
                {
                    var x = distanceList[i + 1];
                    distanceList[i + 1] = distanceList[i];
                    distanceList[i] = x;

                    var y = ajaxResult[i + 1];
                    ajaxResult[i + 1] = ajaxResult[i];
                    ajaxResult[i] = y;

                    swapped = true;
                }
            }
        }
    } while (swapped === true);

    return distanceList;
}

function rad(x)
{
    return x * Math.PI / 180;
}

/*
 * 
 * @param {type} option
 * @returns {Boolean}
 * ACCEPTS THE USER LOCATION AND ADDS ACTION LISTENERS TO EACH MARKER
 * IN THE MARKER ARRAY. THE ACTION LISTENER CALLS THE PLOT ROUTE
 * FUNCTION AND PASSES IT THE MARKER POSITION AND USER POSITION
 */
function addMarkerListeners(markers, i, control)
{
    if (markers[i])
    {
        google.maps.event.addListener(markers[i], 'click', (function (i)
        {
            return function ()
            {
                selectedPosition = markers[i].getPosition();
                plotRoute(markers[i].getPosition(), myCenter);
            };
        })(i));// function closure on the "i" variable

        directionsDisplay.setMap(mapObj);
        document.getElementById('right-panel').innerHTML = "";
        directionsDisplay.setPanel(document.getElementById('right-panel'));

        mapObj.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    }
}

/*
 * 
 * @param {type} emotionInteger
 * @returns {undefined}
 * ACCESS THE GOOGLE DIRECTIONS API AND PLOTS A ROUTE
 */
function plotRoute(pos, myCenter)
{
    var transportModes = ["DRIVING", "WALKING", "BICYCLING", "TRANSIT"];
    var request = {
        origin: myCenter,
        destination: pos,
        travelMode: transportModes[transportMode]
    };

    directionsService.route(request, function (result, status) {
        if (status === 'OK')
        {
            directionsDisplay.setDirections(result);
        }
    });
}

function removeTable()
{
    if (numTables > 0)
    {
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        while (numTables > 0)
        {
            $("#retTab").remove();
            numTables--;
        }
    }
}

function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    }
    else
    {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position)
{
    removeMarkers();
    userPos = position;
}

function removeMarkers()
{
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    if (markers.length > 0)
    {
        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        while (markers.length > 0)
        {
            markers.pop();
        }
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Try refreshing the page. If the issue persists please try another browser");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

//THIS FUNCTIONS BUILD THE MAPS
function initializeMap()
{       //USER LOCATION
    myCenter = new google.maps.LatLng(userPos.coords.latitude, userPos.coords.longitude);
    var control = document.getElementById('floating-panel');
    control.style.display = 'block';

    var mapProp =
            {
                center: myCenter,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
    mapObj = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    //MAKING SURE THE DATA ARRAY HAS SOMETHING IN IT
    if (ajaxResult.length > 0)
    {
        for (var i = 0; i < ajaxResult.length; i++)
        {
            var lat = parseFloat(ajaxResult[i][6]);
            var lng = parseFloat(ajaxResult[i][7]);
            var pos = {lat: lat, lng: lng};
            //BUILDING THE DESTINATION MARKERS
            var suggestionMarker = new google.maps.Marker({
                position: pos,
                icon: markerNames[i],
                title: ajaxResult[i][1]
            });
            markers.push(suggestionMarker);//ADDING TO THE MARKER ARRAY
            suggestionMarker.setMap(mapObj);//ADDING TO THE MAP*/
            addMarkerListeners(markers, i, control);
        }
    }

    //MARKER FOR THE USER LOCATION
    var userImage = 'http://maps.google.com/mapfiles/ms/micons/blue.png';
    var userMarker = new google.maps.Marker({
        position: myCenter,
        icon: userImage
    });
    markers.push(userMarker);

    userMarker.setMap(mapObj);

    //USER INFORMATION WINDOW
    var userString = "You!";
    var infowindow = new google.maps.InfoWindow({
        content: userString
    });
    infowindow.open(mapObj, userMarker);
}