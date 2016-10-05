<?php
require("DB.php");

$emotion = (isset($_GET['opt'])) ? $_GET['opt'] : '';

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());

$query = "select a.name, a.description, a.emotion_id "
        . "from activity a, emotion e "
        . "where e.name = '$emotion' "
        . "and e.id = a.emotion_id";

//Execute query
$qry_result = $mysqli->query($query);

//initial array to encapsulate each individual row
$jsonArray = array();

// Insert a new array for each row returned
while ($row = $qry_result->fetch_assoc()) {
    $rowArray = array($row["name"], $row["description"], $row["emotion_id"]);
    array_push($jsonArray, $rowArray);
}
echo json_encode($jsonArray);
$mysqli->close();
?>