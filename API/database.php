<?php

require(dirname($_SERVER['DOCUMENT_ROOT']) . '/vendor/autoload.php');
use Aura\Sql\ExtendedPdo;

$conn = new ExtendedPdo(
    'mysql:host=localhost:8889;dbname=beta-pi;charset=utf8',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

function dbFile ($filename) {
    return 'db/' . $filename . '.php';
}

include dbFile('events');
include dbFile('tasks');
include dbFile('files');

function test () {
    $post = $_POST;
    $args = $post['args'];

    $test = array(
        'test1' => $args['test1'],
        'test2' => $args['test2']
    );
    echo 'reached';
    print_r($test);
}

?>
