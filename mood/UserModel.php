<?php
require("DB.php");
//connect to the database

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());
if (!$mysqli) {
    die('Could not connect: ' . mysql_error());
}

$googleUserId = (isset($_POST['id'])) ? $_POST['id'] : '';

$query = "SELECT * FROM user where google_id = '$googleUserId'";
$qry_result = $mysqli->query($query);
echo json_encode($query);

$mysqli->close();
?>