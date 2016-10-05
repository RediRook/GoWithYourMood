<?php
require("DB.php");

$googleUserId = (isset($_POST['id'])) ? $_POST['id'] : '';
$email = (isset($_POST['email'])) ? $_POST['email'] : '';
$name = (isset($_POST['name'])) ? $_POST['name'] : '';

$db = new DB();
$mysqli = new mysqli($db->getHost(), $db->getUser(), $db->getPass(), $db->getName());
// Check connection

if ($mysqli->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else
{
    $selectQuery = "select * from user where google_id =".$googleUserId.";";
    $selectResult = $mysqli->query($selectQuery);
    if($selectResult)
    {
        if($selectResult->num_rows === 0)
        {
            $date = date("Y-m-d");
            $insertQuery = "insert into user (email,google_id,name, date_registered) values ('$email','$googleUserId','$name','$date');";
            if($mysqli->query($insertQuery) == false)
            {
                echo "Error: " . $insertQuery . "<br>" . $mysqli->error;
            }
        }
    }
}

$mysqli->close();
?>
