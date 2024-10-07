<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

$first_name = $data->first_name;
$last_name = $data->last_name;
$user_name = $data->user_name;
$email = $data->email;
$country_code = $data->country_code;
$phone = $data->phone;
// $password = $data->password;

// Establish the database connection
$conn = mysqli_connect("localhost", "root", "");
mysqli_select_db($conn, "fb-login");

// Prepare the SQL insert statement
$sql = "INSERT INTO registration (first_name, last_name, user_name, email, country_code, phone) 
        VALUES ('$first_name', '$last_name', '$user_name', '$email', '$country_code', '$phone')";

$result = mysqli_query($conn, $sql);

if ($result) {
    // // Fetch all emails from the result set
    // while ($row = mysqli_fetch_assoc($result)) {
    //     $emails[] = $row['email'];
    // }

    $response = [
        'status' => 'Valid',
        'message' => 'Successfully Created account',
    ];
} else {
    $response = [
        'status' => 'Invalid',
        'message' => 'Can\'t create your account here.   
                        Try using another Email id',
        'email' => $email,
    ];
}

echo json_encode($response);

mysqli_close($conn);
?>
