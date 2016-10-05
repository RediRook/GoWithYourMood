<?php
require("DB.php");
//connect to the database

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());
if (!$mysqli) {
    die('Could not connect: ' . mysql_error());
}

$googleUserId = (isset($_GET['id'])) ? $_GET['id'] : '';

$query = "SELECT r.review, r.date, s.name "
        . "FROM review r, service s "
        . "where user_id = '$googleUserId' "
        . "and s.id = r.service_id "
        . "order by r.date desc";

$qry_result = $mysqli->query($query);

$jsonArray = array();
while ($row = $qry_result->fetch_assoc()) {
    $newDate = date("d-m-Y", strtotime($row["date"]));
    $rowArray = array($row["name"], $row["review"], $newDate);
    
    array_push($jsonArray, $rowArray);
}

echo json_encode($jsonArray);
$mysqli->close();    
?>