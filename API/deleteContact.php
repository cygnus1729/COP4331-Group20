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
    # prepare query to delete contact
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID=? AND UserID=?");

    # bind input values to query
    $stmt->bind_param("ii", $inData["ContactID"], $inData["UserID"]);

    if($stmt->execute())
    {
        # successfully deleted contact
        returnWithInfo("Contact deleted successfully");
    }
    else
    {
        # deletion failed
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
