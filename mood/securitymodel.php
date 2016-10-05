<?php
require("SearchLocation.php");
require("DB.php");

$lat = (isset($_GET['lat'])) ? $_GET['lat'] : '';
$lng = (isset($_GET['long'])) ? $_GET['long'] : '';
$active = (isset($_GET['act'])) ? $_GET['act'] : '';
$social = (isset($_GET['soc'])) ? $_GET['soc'] : '';
$searchRad = (isset($_GET['rad'])) ? $_GET['rad'] : '';
$limitVar = (isset($_GET['numRes'])) ? $_GET['numRes'] : '';

$geo = new SearchLocation();
$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());

$latLng = $geo->getSQL($lat,$lng, $searchRad);

//build query
$query = "SELECT s.id,s.name,s.address,s.suburb,s.postcode,s.phone,s.latitude,s.longitude,s.description,s.service_type, s.rating "
        . "FROM service s, emotion_service es, emotion e "
        . "where s.latitude < '$latLng[0]' and s.latitude > '$latLng[1]' "
        . "and s.longitude < '$latLng[2]' and s.longitude > '$latLng[3]' "
        . "and e.name = 'afraid' "
        . "and e.id = es.emotion_id "
        . "and es.service_id = s.id "
        . "order by s.rating desc "
        . "LIMIT $limitVar"; 

//Execute query
$qry_result = $mysqli->query($query);

//initial array to encapsulate each individual row
$jsonArray = array();

// Insert a new array for each row returned
while ($row = $qry_result->fetch_assoc()) {
    $rowArray = [$row["id"], $row["name"], $row["address"], $row["suburb"], $row["postcode"], 
        $row["phone"], $row["latitude"], $row["longitude"], $row["description"], $row["service_type"],$row["rating"]];
    array_push($jsonArray, $rowArray);
}
echo json_encode($jsonArray);
$mysqli->close();
?>