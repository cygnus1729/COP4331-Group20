<?php
session_start();

$inData = getRequestInfo();

header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['userId'])) {
    sendResponse(["error" => "User not authenticated."]);
    exit();
}

$contactId = $input['id'];
$firstName = $input['firstName'];
$lastName = $input['lastName'];
$phone = $input['phone'];
$email = $input['email'];

if (!isset($input['id'], $input['firstName'], $input['lastName'], $input['phone'], $input['email'])) {
    sendResponse(["error" => "Invalid input. Missing required fields."]);
    exit();
}

$conn = new mysqli("localhost", "root", "", "CONTACTSMANAGER");

if ($conn->connect_error) {
    sendResponse(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Ensure the contact being updated belongs to the logged-in user
$stmt = $conn->prepare("UPDATE contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $contactId);

if ($stmt->execute()) {
    sendResponse(["success" => "Contact updated successfully."]);
} else {
    sendResponse(["error" => "Failed to update contact."]);
}

$stmt->close();
$conn->close();

    function getRequestInfo()
	{
        # get file content from input stream and turn to json array
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj )
	{
        # sends $obj to frontent
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $status )
	{
		$retValue = '{"status":' . $status . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
    function sendResponse($response) {  
        echo json_encode($response);
    }
?>