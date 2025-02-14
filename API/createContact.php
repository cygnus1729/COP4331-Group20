<?php
	$inData = getRequestInfo();

    // Might have to replace these depending on name of fields in DB
	$userId    = $inData["userId"];      
	$firstName = $inData["firstName"];
	$lastName  = $inData["lastName"];
	$email     = $inData["email"];

	// We need to replace with DB credentials and name to connect
	$conn = new mysqli("localhost", "root", "", "User");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email) VALUES (?,?,?,?)");
		$stmt->bind_param("isss", $userId, $firstName, $lastName, $email);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			$newId = $stmt->insert_id;
			returnWithInfo($newId);
		}
		else
		{
			returnWithError("Error creating contact");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($newId)
	{
		$retValue = '{"id":' . $newId . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>
