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

function getEvents () {
    global $conn;

    $today = date('Ymd');
    $query = 'SELECT * FROM `events` WHERE date >= ' . date('Y') . '-01-01 ORDER BY `date`';
    $res   = $conn->fetchAll($query);

    echo json_encode($res);
}

function postEvents () {
    global $conn;

    $post = $_POST;
    $args = $post['args'];

    $query = 'INSERT INTO `events` (`name`, `date`, `time_start`, `time_end`, `repeats`, `description`) ' .
        'VALUES (:name, :time_start, :time_end, :date, :repeats, :description)';
    $res   = $conn->perform($query, $args);
}

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
