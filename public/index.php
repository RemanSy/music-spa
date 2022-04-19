<?php

require_once '../vendor/autoload.php';

use app\server\Router;
use app\server\View;
use app\server\controllers\MainController;
use app\server\controllers\UsersController;
use app\server\controllers\GroupsController;
use app\server\controllers\AlbumsController;
use app\server\controllers\TracksController;

$router = new Router();
$view = new View();

$router->get('/test', [MainController::class, 'test']);

// Handle main requests
$router->get('@^/[a-zA-Z]{0,}$@', [MainController::class, 'index']);

$router->get('/templates/nav', [MainController::class, 'nav']);

$router->get('/countries/search', [MainController::class, 'countries']);

$router->get('/genres/search', [MainController::class, 'genres']);

// API Users
$router->get('/users/get', [UsersController::class, 'get']);

$router->post('/users/add', [UsersController::class, 'add']);

$router->post('/users/auth', [UsersController::class, 'auth']);

$router->put('/users/update', [UsersController::class, 'update']);

$router->delete('/users/delete', [UsersController::class, 'delete']);


// API Groups
$router->get('/groups/get', [GroupsController::class, 'get']);

$router->post('/groups/add', [GroupsController::class, 'add']);

$router->delete('/groups/delete', [GroupsController::class, 'delete']);

$router->get('/groups/search', [GroupsController::class, 'search']);


// API Albums
$router->get('/albums/get', [AlbumsController::class, 'get']);

$router->get('/albums/group', [AlbumsController::class, 'group']);

$router->post('/albums/add', [AlbumsController::class, 'add']);

$router->delete('/albums/delete', [AlbumsController::class, 'delete']);


// API Tracks
$router->get('/tracks/get', [TracksController::class, 'get']);

$router->get('/tracks/getOne', [TracksController::class, 'getOne']);

$router->get('/tracks/album', [TracksController::class, 'album']);

$router->post('/tracks/add', [TracksController::class, 'add']);

$router->delete('/tracks/delete', [TracksController::class, 'delete']);


$router->resolve();