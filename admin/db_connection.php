<?php
$servername = "196.221.151.195"; // Database IP
$username = "dev"; // Your database username
$password = "DevBor3i238$$"; // Your database password
$dbname = "ecom_db"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Test a simple query
$sql = "SELECT * FROM users"; // Adjust the table name as needed
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"] . " - Username: " . $row["username"] . " - Email: " . $row["email"] . "<br>";
    }
} else {
    echo "0 results";
}

$conn->close(); // Close the connection
?>