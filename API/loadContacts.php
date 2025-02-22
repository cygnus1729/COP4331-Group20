<?php
    # Connect to the database CONTACTSMANAGER on localhost server, as root with no password
    $conn = new mysqli("localhost", "root", "", "CONTACTSMANAGER");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        # Query to get all contacts
        $stmt = $conn->prepare("SELECT * FROM contacts");
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

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($error) {
        sendResultInfoAsJson(json_encode(array("error" => $error)));
    }
?>