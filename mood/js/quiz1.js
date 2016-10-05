window.onload = function () {
    initializePage();
};

/*
 * adds the actions listeners for the emotion images
 */
function initializePage()
{
    document.getElementById("searchHappy").addEventListener("click", function () {
        mapRedirect(5);
    });
    document.getElementById("searchCelebratory").addEventListener("click", function () {
        mapRedirect(6);
    });
    document.getElementById("searchEnergetic").addEventListener("click", function () {
        mapRedirect(7);
    });

    document.getElementById("btnHappy").addEventListener("click", function () {
        switchVisibleStatistics(1);
    });
    document.getElementById("btnCelebratory").addEventListener("click", function () {
        switchVisibleStatistics(2);
    });
    document.getElementById("btnEnergetic").addEventListener("click", function () {
        switchVisibleStatistics(3);
    });

    document.getElementById("txtHappy").addEventListener("click", function () {
        switchVisibleStatistics(1);
    });
    document.getElementById("txtCelebratory").addEventListener("click", function () {
        switchVisibleStatistics(2);
    });
    document.getElementById("txtEnergetic").addEventListener("click", function () {
        switchVisibleStatistics(3);
    });
}

/*
 * changes which questions are displayed depending on which emotino has been selected
 */
function switchVisibleStatistics(emotionInteger) {
    switch (emotionInteger) {
        case 1:
            document.getElementById('happyDisplay').style.display = 'block';
            document.getElementById('celebratoryDisplay').style.display = 'none';
            document.getElementById('energeticDisplay').style.display = 'none';
            break;
        case 2:
            document.getElementById('happyDisplay').style.display = 'none';
            document.getElementById('celebratoryDisplay').style.display = 'block';
            document.getElementById('energeticDisplay').style.display = 'none';
            break;
        case 3:
            document.getElementById('happyDisplay').style.display = 'none';
            document.getElementById('celebratoryDisplay').style.display = 'none';
            document.getElementById('energeticDisplay').style.display = 'block';
            break;
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
        case 5://happy           
            if (document.getElementById("happyQ1a").checked === true)
            {
                active = 1;//"go out";
            }
            else if (document.getElementById("happyQ1b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("happyQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("happyQ2a").checked === true)
            {
                social = 1;//"meet with people";
            }
            else if (document.getElementById("happyQ2b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("happyQ2Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
        case 6://celebratory            
            if (document.getElementById("celebratoryQ1a").checked === true)
            {
                active = 1;//"go out";
            }
            else if (document.getElementById("celebratoryQ1b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("celebratoryQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("celebratoryQ2a").checked === true)
            {
                social = 1;//"go to restaurant or bar";
            }
            else if (document.getElementById("celebratoryQ2b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("celebratoryQ2Head").style.background = 'OrangeRed';
                checked = false;
            }
            break;
        case 7://energetic            
            if (document.getElementById("energeticQ1a").checked === true)
            {
                active = 1;//"find a park";
            }
            else if (document.getElementById("energeticQ1b").checked === true)
            {
                active = 2;//"not";
            }
            else
            {
                document.getElementById("energeticQ1Head").style.background = 'OrangeRed';
                checked = false;
            }

            if (document.getElementById("energeticQ2a").checked === true)
            {
                social = 1;//"go to gym";
            }
            else if (document.getElementById("energeticQ2b").checked === true)
            {
                social = 2;//"not";
            }
            else
            {
                document.getElementById("energeticQ2Head").style.background = 'OrangeRed';
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