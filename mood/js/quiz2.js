window.onload = function () {
    initializePage();
};

/*
 * adds the actions listeners for the emotion images
 */
function initializePage()
{
    document.getElementById("searchAnxious").addEventListener("click", function () {
        mapRedirect(1);
    });
    document.getElementById("searchSad").addEventListener("click", function () {
        mapRedirect(2);
    });
    document.getElementById("searchIsolated").addEventListener("click", function () {
        mapRedirect(3);
    });
    document.getElementById("searchUnsafe").addEventListener("click", function () {
        mapRedirect(4);
    });

    document.getElementById("btnAnxious").addEventListener("click", function () {
        switchVisibleStatistics(1);
    });
    document.getElementById("btnSad").addEventListener("click", function () {
        switchVisibleStatistics(2);
    });
    document.getElementById("btnIsolated").addEventListener("click", function () {
        switchVisibleStatistics(3);
    });
    document.getElementById("btnUnsafe").addEventListener("click", function () {
        switchVisibleStatistics(4);
    });

    document.getElementById("txtAnxious").addEventListener("click", function () {
        switchVisibleStatistics(1);
    });
    document.getElementById("txtSad").addEventListener("click", function () {
        switchVisibleStatistics(2);
    });
    document.getElementById("txtIsolated").addEventListener("click", function () {
        switchVisibleStatistics(3);
    });
    document.getElementById("txtUnsafe").addEventListener("click", function () {
        switchVisibleStatistics(4);
    });
}

/*
 * changes which questions are displayed depending on which emotino has been selected
 */
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
    }
}

/*
 * accepts input from form and readies data to be sent to the suggestions.js
 * to be processed
 */
function checkInfoForm(option)
{
    var checked = true;
    var active;
    var social;
    switch (option)
    {
        case 1://anxious
            if (document.getElementById("anxiousQ1a").checked === true)
            {
                social = 1;//"social";
            }
            else if (document.getElementById("anxiousQ1b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("anxiousQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("anxiousQ2a").checked === true)
            {
                active = 1;//"active";
            }
            else if (document.getElementById("anxiousQ2b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("anxiousQ2Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
        case 2://sad
            if (document.getElementById("sadQ1a").checked === true)
            {
                active = 1;//"active";
            }
            else if (document.getElementById("sadQ1b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("sadQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("sadQ2a").checked === true)
            {
                social = 1;//"social";
            }
            else if (document.getElementById("sadQ2b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("sadQ2Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
        case 3://isolated
            if (document.getElementById("isolatedQ1a").checked === true)
            {
                active = 1;//"active";
            }
            else if (document.getElementById("isolatedQ1b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("isolatedQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("isolatedQ2a").checked === true)
            {
                social = 1;//"social";
            }
            else if (document.getElementById("isolatedQ2b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("isolatedQ2Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
        case 4://unsafe
            if (document.getElementById("unsafeQ1a").checked === true)
            {
                active = 4;//"unsafe";
                social = 4;//"unsafe";
            }
            else if (document.getElementById("unsafeQ1b").checked === true)
            {
                active = 5;//"safe";
                social = 5;//"safe";
            }
            else
            {
                document.getElementById("unsafeQ1Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
    }
    if (checked)
    {
        var info = [active, social];
        return info;
    }
    return null;
}

/*
 * accepts the data chosen by the user and passes it to suggestions.js
 */
function mapRedirect(option)
{
    var info = checkInfoForm(option);
    if (info !== null)
    {
        window.location = 'suggestions.html?op=' + option + '&ac=' + info[0] + '&so=' + info[1];
    }
}