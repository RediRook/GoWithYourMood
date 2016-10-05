window.onload = function() 
{
  initializePage();
};

function initializePage()
{
    var urlString = window.location.search.substring(1);
    console.log(urlString);
    
    var idIndex = urlString.indexOf("id=");
    idIndex = idIndex + 3;
    var id = urlString.substring(idIndex,urlString.indexOf("&name"));
    
    var nameIndex = urlString.indexOf("&name");
    nameIndex = nameIndex + 6;
    var name = urlString.substring(nameIndex,urlString.indexOf("&address"));
    
    var addrIndex = urlString.indexOf("&address");
    addrIndex = addrIndex + 9;
    var address = urlString.substring(addrIndex,urlString.indexOf("&suburb"));
    
    var subIndex = urlString.indexOf("&suburb");
    subIndex = subIndex + 8;
    var suburb = urlString.substring(subIndex,urlString.indexOf("&lat"));    
    
    var latIndex = urlString.indexOf("&lat");
    latIndex = latIndex + 5;
    var lat = urlString.substring(latIndex,urlString.indexOf("&lng"));
    
    var lngIndex = urlString.indexOf("&lng");
    lngIndex = lngIndex + 5;
    var lng = urlString.substring(lngIndex,urlString.length);
    
    var ajaxRequest = createAJAXRequest();
    var urlString = 'GetReviews.php?id='+id;
    ajaxRequest.open("GET", urlString, true);
    ajaxRequest.send(null);
    ajaxRequest.onreadystatechange = function ()
    {       
        if (ajaxRequest.readyState === 4)
        {
            ajaxResult = JSON.parse(ajaxRequest.responseText);
            console.log(ajaxResult);
            if(ajaxResult.length > 0)
            {
                displayResults(ajaxResult);
            }
            else
            {
                alert("Be the first to review!");
            }
        }
    };
    
    var heading = document.getElementById("revHeading");
    //heading.innerHTML = "What did you think of " + name + "?";

    //document.getElementById("btn").addEventListener("click", function(){submitForm(id);}); 
}
/*
 * 
 * @param {type} ajaxResult
 * ajaxResult[i][0] = google_id
 * ajaxResult[i][1] = review text
 * ajaxResult[i][2] = anonymous or not
 * ajaxResult[i][3] = name
 */
function displayResults(ajaxResult)
{alert(ajaxResult);
    var retTab = document.createElement('table');
    for(var i = 0; i < ajaxResult.length-1; i++)
    {
        var row1 = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            
        td1.innerHtml = ajaxResult[i][3];
        td2.innerHtml = ajaxResult[i][2];
        
        row1.appendChild(td1);
        row1.appendChild(td2);
        retTab.appendChild(row1);
    }
    
    var div = document.getElementById("resultsTable");
    div.appendChild(retTab);
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