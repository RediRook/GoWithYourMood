<?php
require("DB.php");

$review = (isset($_GET['feedback'])) ? ($_GET['feedback']) : '';
$google_user_id = (isset($_GET['userId'])) ? ($_GET['userId']) : '';
$serviceID = (isset($_GET['serviceId'])) ? ($_GET['serviceId']) : '';
$anonVar = (isset($_GET['anon'])) ? ($_GET['anon']) : '';

$date = date("Y-m-d");

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());

if ($mysqli->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    $date = date("Y-m-d");
    $insertReview = "insert into review (user_id, review, service_id, date, anonymous) "
            . "values('$google_user_id', '$review','$serviceID','$date',$anonVar)";
    $mysqli->query($insertReview);

    echo json_encode($insertReview);
}

$mysqli->close();
?>