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
    # prepare query to update contact
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ContactID=? AND UserID=?");

    # bind input values to query
    $stmt->bind_param("ssssii", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ContactID"], $inData["UserID"]);

    if($stmt->execute())
    {
        # successfully updated contact
        returnWithInfo("Contact updated successfully");
    }
    else
    {
        # update failed
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