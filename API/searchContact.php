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
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=?");

        # bind login and password from frontend to query
		$stmt->bind_param("i", $inData["UserID"]);
		$stmt->execute();

		$rows = $stmt->fetchAll();

		if(Count($rows) === 0)
		{
            # user has no contacts
			returnEmpty();
		}
		else
		{
			# user has contacts
			sendResultInfoAsJson($rows);
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

    function returnEmpty()
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","phone":"","email":""}';
		sendResultInfoAsJson( $retValue );
	}
?>