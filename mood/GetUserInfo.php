<?php
require("DB.php");
//connect to the database

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());
if (!$mysqli) {
    die('Could not connect: ' . mysql_error());
}

$googleUserId = (isset($_GET['id'])) ? $_GET['id'] : '';

$query = "SELECT * FROM user where google_id = '$googleUserId'";
$qry_result = $mysqli->query($query);
$row = $qry_result->fetch_assoc();
echo json_encode($row);

$mysqli->close();
?>