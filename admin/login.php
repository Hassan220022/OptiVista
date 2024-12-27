<?php
session_start(); // Start the session
include 'db_connection.php'; // Include your database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Fetch user from the database
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password_hash'])) {
            // Successful login
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role']; // Store the user's role
            echo json_encode(['status' => 'success', 'role' => $user['role']]); // Return role
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid password.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No user found with that username.']);
    }
}

$conn->close(); // Close the connection
?>