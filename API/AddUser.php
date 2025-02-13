<?php
    # input from frontend
    $inData = getRequestInfo();
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    # connect to database CONTACTSMANAGER on lacalhost server, as root with password
    $conn = new mysqli("localhost", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
	{
        # prepare query to get id, firstname, and last name
        $stmt = $conn->prepare("INSERT INTO Users (ID, FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?, ?)");

        # bind login and password from frontend to query
		$stmt->bind_param("issss", $inData["ID"], $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData[]);

		if( $stmt->execute() )
		{
            # successfully added user
			returnWithInfo("success");
		}
		else
		{
            # couldn't add user
			returnWithError($stmt->error);
		}

        # close connection to database
		$stmt->close();
		$conn->close();
	}

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
?>