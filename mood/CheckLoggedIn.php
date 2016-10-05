<?php
session_start();
$user = 0;
/*
if(isset($_SESSION["id"])&&isset($_SESSION["name"]))
{
    $user = [$_SESSION["id"],$_SESSION["name"]];
}*/

//$user = [$_SESSION["id"],$_SESSION["name"]];

echo json_encode($user);
?>