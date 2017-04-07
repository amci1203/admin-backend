<?php

function getEvents ($from) {
    global $conn;

    if ( isset($from) ) {
        $d    = date_create($from);
        $from = date_format($d, 'Ymd');
    }
    else {
        $d    = date_create(date('Y') . '-01-01');
        $from = date_format($d, 'Ymd');
    }
    $query = 'SELECT * FROM `events` WHERE `date` > ' . $from . ' ORDER BY `date`';

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

?>
