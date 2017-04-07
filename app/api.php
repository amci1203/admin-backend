<?php
    // Don't allow this script to be accessed directly
    if ( !isset($_SERVER['HTTP_X_REQUESTED_WITH']) ) {
        header('Location: ' . $_SERVER['DOCUMENT_ROOT'] . '/no.html');
    }

    require '../API/auth0.php';

    function path ($file) {
        $api = dirname($_SERVER['DOCUMENT_ROOT']) . '/API/';
        return $api . $file . '.php';
    }

    $file = $_POST['file'];
    $func = $_POST['func'];

    if ( !isset($file) ) die('No file specified');
    else {
        require path($file);

        if (isset($func)) {
            try { $func(); }
            catch (Exception $e) {
                // I'm going to assume the function is undefined, or doesn't work.
                die('That function either does not exist, or has thrown an error');
            }
        }
    }

?>
