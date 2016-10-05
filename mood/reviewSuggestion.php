<?php

require("DB.php");
//connect to the database

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());
if (!$mysqli) {
    die('Could not connect: ' . mysql_error());
}
// echo 'Connected successfully';

$serviceID = (isset($_GET['id'])) ? $_GET['id'] : '';

$query = "SELECT r.id, r.user_id, r.service_id, r.review, r.date, r.anonymous, u.name "
        . "FROM review r, user u "
        . "WHERE service_id = '$serviceID' "
        . "AND u.google_id = r.user_id "
        . "ORDER BY r.date DESC";

//execute the sql

$qry_result = $mysqli->query($query);

$jsonArray = array();
while ($row = $qry_result->fetch_assoc()) {
    $newDate = date("d-m-Y", strtotime($row["date"]));
    $rowArray = [$row["id"], $row["user_id"], $row["service_id"], $row["review"], $newDate, $row["anonymous"], $row["name"]];
    array_push($jsonArray, $rowArray);
}
echo json_encode($jsonArray);
?>