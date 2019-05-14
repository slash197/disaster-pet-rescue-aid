<?php
/*
 *	@Author: Slash Web Design
 */

ini_set("error_log", "php-error.log");
ini_set("memory_limit", "256M");
session_start();
error_reporting(E_ALL);

require 'models/core/autoloader.php';
require 'config.php';

$glob	= array();
$db		= new Database("mysql:host={$config['host']};dbname={$config['database']}", $config['username'], $config['password']);
$api	= new API();

$api->{$api->input->method}();