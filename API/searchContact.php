<?php
    session_start();

	$inData = getRequestInfo();

	$searchTerm = $inData["searchTerm"];
    
    if (isset($_SESSION['userId'])) {
        $userId = $_SESSION['userId'];
    } else {
        returnWithError("User ID is not set in the session.");
    }

    # Connect to the database CONTACTSMANAGER on localhost server, as root with no password
    $conn = new mysqli("54.175.158.14", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {

		if ($searchTerm != '') {
    		$searchTerm = "%$searchTerm%";
    		$stmt = $conn->prepare("SELECT * FROM contacts WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ? OR ID LIKE ?)");
    		$stmt->bind_param("isssss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
		} else {
    		$stmt = $conn->prepare("SELECT * FROM contacts WHERE UserID = ?");
    		$stmt->bind_param("i", $userId);
		}

        $stmt->execute();

        $result = $stmt->get_result();
        $contacts = array(); // Array to store all contacts

        while ($row = $result->fetch_assoc()) {
            $contacts[] = array(
                "id" => $row["ID"], 
                "firstName" => $row["FirstName"],
                "lastName" => $row["LastName"],  
                "phone" => $row["Phone"], 
                "email" => $row["Email"]
            );
        }

        if (count($contacts) == 0) {
            returnWithError("No Records Found");
        } else {
            sendResultInfoAsJson(json_encode($contacts));
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

    function returnWithError($error) {
        sendResultInfoAsJson(json_encode(array("error" => $error)));
    }
?>