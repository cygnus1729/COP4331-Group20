<?php
	session_start();

	$inData = getRequestInfo();

    // Might have to replace these depending on name of fields in DB
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $_SESSION['userId'];

	// We need to replace with DB credentials and name to connect
	$conn = new mysqli("localhost", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
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
