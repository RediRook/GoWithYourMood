<?php
require("reviewSuggestion.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Go With Your Mood | Location</title>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" media="screen" href="css/reset.css">
<link rel="stylesheet" type="text/css" media="screen" href="css/grid_12.css">
<link rel="stylesheet" type="text/css" media="screen" href="css/style.css">
<link rel="stylesheet" type="text/css" media="screen" href="css/style_review.css">
<link href='http://fonts.googleapis.com/css?family=Lato:300italic' rel='stylesheet' type='text/css'>
<script src="js/jquery-1.7.min.js"></script>
<script src="js/jquery.easing.1.3.js"></script>
<script src="js/cufon-yui.js"></script>
<script src="js/cufon-replace.js"></script>
<script src="js/Bilbo_400.font.js"></script>
<script src="js/location.js"></script>
<script src="js/submitFeedback.js"></script>
 
<!--script for call functions-->
<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyC1osJzH1LqcfkEU7G9AbahVjfwXb6OsoI"></script>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<meta name="google-signin-client_id" content="203070328921-5gf4a874q1eo1v05uv23np04786dgt6h.apps.googleusercontent.com">
<script src="js/login.js"></script>
<!--script for call functions-->
<!--[if lt IE 9]>
<script src="js/html5.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="css/ie.css">
<![endif]-->
</head>
<body>
<header>
  <div>
    <div>
      <h1><a href="index.html"><img src="images/Logo2.png" alt=""></a></h1>
      <nav>
        <ul class="menu">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>  
		  <li id="my-signin2"></li>
          <li class="testUser" id ="loggedUser">Logged in as:</li>
		  <li><a id="mySignOut" onClick="signOut()">Sign Out</a></li>		  
        </ul>
      </nav>
      <div class="clear"></div>
    </div>
  </div>
</header>
<a href="" id="backId">Back</a>
<!--==============================content================================-->
<div style="background-color:#f2f2f2">
<section id="content">
  <div class="container_12 top">
      <div id="returnDiv" class="tablefield img-border">
          <table class="detailTable">
              <tr>
                  <td>Name: </td>
                  <td><div id="suggName"></div></td>
                  <td></td>
              </tr>
              <tr>
			      <td>Address: </td>
                  <td><div id="suggAddress"></div>
					<div id="suggSuburb"></div>
					<div id="suggPost"></div>
				  </td>
				  <td>
				  </td>
              </tr>
              <tr>
                  <td>Description: </td>
                  <td><div id="suggDesc">/div></td>
                  <td></td>
              </tr>
          </table>
      </div>
	  
	<div class="mapfield img-border">
	<div id="googleMap" class="map2"></div>
	</div>

	<div class="directionPanel img-border">
	  <div>
		<div>  
		  <div id="floating-panel"> 
			<strong>Start:</strong>
			<p id="start"></p>
			<strong>Destination:</strong>
			<p id="end"></p>
		  </div>
		  <div id="right-panel"></div>
		</div>
		<div class="clear"></div>
	  </div>
	</div>

<div style="float:left; width:960px; height:300px; margin: 12px 0px 15px; border:solid;">
 <table class="table-Review">
<!--header for the tables -->
  <tr>
    <th>User Name</th>
    <th>Date </th>
    <th>Review</th>
  </tr>
  <!-- populating the values to the table -->
  <?php foreach($data as $value) : ?>
  <tr>
    <td><?php echo $value['user_id']; ?></td>
    <td><?php echo $value['date']; ?></td>
    <td><?php echo $value['review']; ?></td>
  </tr>
  <?php endforeach; ?>
  
</table>
	</div>
 </div>
</section>
<section>
<p><button id="modal_open">Give Your Feedback</button></p>
<div id="modal_wrapper">
<div id="modal_window">
 

<form id="modal_feedback" method="POST" action="#" onSubmit="storeFeedback()" accept-charset="UTF-8"> <!-- calls storeFeedBack fucntion database-->
	<p><label>Dear Google User,<br>Your feedback helps us to improve.<br>
	<textarea id="textareaId" required name="message" cols="48" rows="8"></textarea></label></p>
        <input type="hidden" id="serviceInput">
	<p><input type="submit" name="feedbackForm" value="Submit" ></p>
        <div style="text-align: right;"><button id="modal_close" >Cancel</button></div><!--ask Nansen to limit the div around cancel --> 
</form>
 
</div> <!-- #modal_window -->
</div> <!-- #modal_wrapper -->
      
</section>
</div>
<!--==============================footer=================================-->
<footer>
  <p>Copyright@Marshmallows.com<br>
    2016 All Right Reserved</p>
  <div class="soc-icons"><span></span><a href="#"><img src="images/Logo4.jpg" alt=""></a></div>
</footer>
<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
<script src="js/initializeFeedback.js"></script>
</body>
</html>