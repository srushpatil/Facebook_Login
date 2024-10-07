<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React app's origin
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers

 // Database configuration
    $host = 'localhost'; // Database host, usually 'localhost'
    $user = 'root'; // Your database username
    $password = ''; // Your database password
    $dbname = 'fb-login'; // Your database name

    // Create connection
    $conn = new mysqli($host, $user, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

// Check for preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Exit for preflight requests
}

// Get the POST data
$data = json_decode(file_get_contents("php://input"));

// Check if email is set
if (isset($data->email)) {
    $email = $data->email;

    // Query to check if the user exists
    $query = "SELECT * FROM registration WHERE email = '$email' LIMIT 1";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        // User exists
        $user = mysqli_fetch_assoc($result);
        echo json_encode([
            "exists" => true,
            "userData" => $user
        ]);
    } else {
        // User does not exist
        echo json_encode([
            "exists" => false
        ]);
    }
} else {
    echo json_encode(["exists" => false]);
}
?>