//function to retrieve profile information from google login
//author: aashu		
function onSuccess(googleUser)
{//change the fields displayed in the navigation bar if the user logs in
    document.getElementById('my-signin2').style.display = 'none';
    document.getElementById('mySignOut').style.display = 'block';
    document.getElementById('myProfile').style.display = 'block';
    var profile = googleUser.getBasicProfile();//retrieve users google profile
    sessionStorage.userID = profile.getId();//store user id in session for later use
    $.ajax({
        type: 'POST',
        url: 'google_user.php?',
        data: {
            id: profile.getId(),
            email: profile.getEmail(),
            name: profile.getName()
        },
        success: function (data) {//make page stop refreshing, sessionStorage variable login, set log in to true when logged in and false when they log ou
            if (sessionStorage.getItem("loggedIn") !== "logged in")
            {
                window.location.reload(false);
            }
            sessionStorage.loggedIn = "logged in";
        }
    });
    var displayLoginNameField = document.getElementById('loggedUser');
    displayLoginNameField.style.display = 'block';
    displayLoginNameField.innerHTML = "Logged in as: " + googleUser.getBasicProfile().getName();
}

function onFailure(error)
{
    console.log(error);
}

function renderButton()
{

    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 40,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

//function to signout the user
function signOut()
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect().then(function ()
    {//change the fields displayed in the navigation if the user logs out
        document.getElementById('mySignOut').style.display = 'none';
        document.getElementById('loggedUser').style.display = 'none';
        document.getElementById('my-signin2').style.display = 'block';
        document.getElementById('myProfile').style.display = 'none';
        console.log('User signed out.');

        sessionStorage.userID = "null";
        sessionStorage.loggedIn = "null";
        window.location = "index.html";
    });
}