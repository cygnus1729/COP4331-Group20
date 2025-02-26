<?php
	$inData = getRequestInfo();
    
    // Might have to replace
	$contactId = $inData["contactId"];

	// More replacing
	$conn = new mysqli("54.175.158.14", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
		$stmt->bind_param("i", $contactId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithInfo("Contact deleted successfully");
		}
		else
		{
			returnWithError("No contact found or unable to delete");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($msg)
	{
		$retValue = '{"error":"","message":"' . $msg . '"}';
		sendResultInfoAsJson($retValue);
	}
?>