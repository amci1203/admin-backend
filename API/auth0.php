<?php

require(dirname($_SERVER['DOCUMENT_ROOT']) . '/vendor/autoload.php');

use Auth0\SDK\Auth0;

$auth0 = new Auth0(array(
    'domain'        => 'beta-pi.auth0.com',
    'client_id'     => 'AGS75FmADdeJXflqw7SjSqb9RFC5DDEw',
    'client_secret' => 'L1JcMXtzBooPwh9Dt0mnqOVMzD0I7Xvv1jtaCVypGuQXxsvrhCDx4FdIQsyICfua',
    'redirect_uri'  => 'http://localhost:3000/admin.php'
));

$user = $auth0 -> getUser();

?>
