<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL);

	session_start();

    # input from frontend
    $inData = getRequestInfo();
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    # connect to database CONTACTSMANAGER on lacalhost server, as root with password (changed for local hosting)
    $conn = new mysqli("localhost", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
	{
        # prepare query to get id, firstname, and last name
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");

        # bind login and password from frontend to query
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);

        # execute and save results
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            # row was returned (user exists)
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
		}
		else
		{
            # no row returned (user doesnt exist)
			returnWithError("No Records Found");
		}

        # close connection to database
		$stmt->close();
		$conn->close();

		$_SESSION['userId'] = $row['ID'];
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>