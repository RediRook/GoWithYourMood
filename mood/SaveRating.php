<?php
require("DB.php");

$userID = (isset($_GET['userId'])) ? $_GET['userId'] : '';
$serviceID = (isset($_GET['id'])) ? $_GET['id'] : '';
$rat = (isset($_GET['rat'])) ? $_GET['rat'] : '';
$date = date("Y-m-d");

if(isset($_SESSION["id"]))
{
    $userID = $_SESSION["id"];
}

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());

$query = "insert into rating(user_id, service_id, rating, date) values('$userID','$serviceID','$rat','$date')";
$qry_result = $mysqli->query($query);
echo($qry_result);

$mysqli->close();

?>