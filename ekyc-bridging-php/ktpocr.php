<?php
require_once "izi/IziClient.php";

header('Content-Type: application/json; charset=utf-8');

$client = new IziClient("pOnSMetMVeuzMCeRZOJP", "dwEYQPRGlejxEDNpglqAjuJObOOdRdLcPBIvANka");
$url = "https://api.roycedata.me/v1/id_ocr/general";
$data = json_decode(file_get_contents('php://input'), true);
$payload = array("img" => $data['image']);
$response = $client->request($url, $payload);
echo $response;