<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "go_with_your_mood";

session_start();

$serviceID = (isset($_GET['id'])) ? $_GET['id'] : '';
$text = (isset($_GET['text'])) ? $_GET['text'] : '';
$anonVar = (isset($_GET['anon'])) ? $_GET['anon'] : '';

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
// Check connection

{
    if ($mysqli->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    else
    {
        $anon = null;//0 = not anonymous, 1 = anonymous
        if(strcmp($anonVar,"yes") === 0)
        {
            $anon = 1;
        }
        else if (strcmp($anonVar,"no") === 0)
        {
            $anon = 0;
        }
        
        $userID = $_SESSION["id"];
        $date = date("Y-m-d");
        $insertReview = "insert into review (user_id, review, service_id, date, anonymous) "
                . "values('$userID', '$text','$serviceID','$date',$anon)";
        $mysqli->query($insertReview);

        $jsonArray = [$insertReview];
        echo json_encode($jsonArray);
    }
}
else
{
    echo json_encode(false);
}
$mysqli->close();
?>