<?php
require("SearchLocation.php");
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "go_with_your_mood";

$lat = (isset($_GET['lat'])) ? $_GET['lat'] : '';
$lng = (isset($_GET['long'])) ? $_GET['long'] : '';


$geo = new SearchLocation();

/*

 * // first-cut bounding box (in degrees)

 * 
 *  */
$mysqli = new mysqli('127.0.0.1', $dbuser, $dbpass, $dbname);

//build query
$query = $geo->getSQL($lat,$lng,3);//"SELECT * FROM service where service_type = 'security' limit 5";

//Execute query
$qry_result = $mysqli->query($query);

//initial array to encapsulate each individual row
$jsonArray = array();

// Insert a new array for each row returned
while ($row = $qry_result->fetch_assoc()) {
    $rowArray = array($row["id"], $row["name"], $row["address"], $row["suburb"], $row["postcode"], $row["phone"], $row["latitude"], $row["longitude"], $row["description"], $row["service_type"]);
    array_push($jsonArray, $rowArray);
}
echo json_encode($jsonArray);//$jsonArray);
?>