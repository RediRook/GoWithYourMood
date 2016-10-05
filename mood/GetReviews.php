<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "go_with_your_mood";

session_start();

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($mysqli->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else
{
    $serviceID = (isset($_GET['id'])) ? $_GET['id'] : '';
    $query = "select r.review, r.user_id, r.anonymous, u.name "
            . "from review r, service s, user u "
            . "where r.service_id = s.id "
            . "and r.user_id = u.google_id "
            . "and s.id = $serviceID";
    $results = $mysqli->query($query);
    
    $jsonArray = array();
    while ($row = $results->fetch_assoc()) 
    {
        $rowArray = array($row['user_id'], $row['review'], $row['anonymous'], $row['name']);
        array_push($jsonArray, $rowArray);
    }
    
    //0 = not anonymous, 1 = anonymous
    for($i = 0; $i < count($jsonArray); $i++)
    {
        if($jsonArray[$i][2] === 1 || $jsonArray[$i][2] === '1')
        {
            $jsonArray[$i][3] = "Anonymous";
        }
    }
    echo json_encode($jsonArray);
}
$mysqli->close();
?>