<?php
# input from frontend
$inData = getRequestInfo();

# connect to database CONTACTSMANAGER
$conn = new mysqli("localhost", "root", "k36oDQwM+jc6", "CONTACTSMANAGER");
if( $conn->connect_error )
{
    returnWithError($conn->connect_error);
}
else
{
    # prepare query to create contact
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");

    # bind input values to query
    $stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"]);

    if($stmt->execute())
    {
        # successfully created contact
        returnWithInfo("Contact created successfully");
    }
    else
    {
        # creation failed
        returnWithError($stmt->error);
    }

    # close connection
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

function returnWithInfo($message)
{
    $retValue = '{"message":"' . $message . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
