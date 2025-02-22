<?php
    # input from frontend
    $inData = getRequestInfo();
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    # connect to database CONTACTSMANAGER on lacalhost server, as root with password
    $conn = new mysqli("localhost", "root", "", "CONTACTSMANAGER");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
	{
        # prepare query to get contact information
        $stmt = $conn->prepare("SELECT * FROM contacts WHERE UserID=?");

        # bind login and password from frontend to query
		$stmt->bind_param("i", $inData["UserID"]);
		$stmt->execute();

		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["Name"] . '"';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
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