<?php

namespace app\server\controllers;
use app\server\Controller;
use app\server\models\User;

class UsersController extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new User();
    }

    public function get() {
        $data = $this->model->get();

        $this->response->setHeader('Access-Control-Allow-Origin: *');
        $this->response->setHeader('Content-type: application/json; charset=utf8');

        echo json_encode($data);
    }

    public function add() {
        $this->response->POSTHeaders();
        
        $data = $this->request->getBody();

        if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
            $this->response->responseCode(400);

            echo json_encode(['message' => 'Not enough data']);
            exit;
        }
        
        $this->model->username = $data['username'];
        $this->model->email = $data['email'];
        $this->model->password = md5($data['password']);
        $this->model->token = $data['token'];
        $this->model->role = 1;

        if (!$this->model->save($data)) {
            $this->response->responseCode(400);
            echo json_encode(['message' => 'Error saving data']);
            exit;
        }

        $this->response->responseCode(200);
    }

    public function auth() {
        $data = $this->request->getBody();
        
        $this->model->email = $data['email'];
        $this->model->password = md5($data['password']);
        $this->model->token = $data['token'];

        echo $this->model->auth();
    }

    public function checkAuth() {
        $res = $this->model->where('token', '=', $_COOKIE['user']);

        echo count($res);
    }

    public function addFavorite() {
        $data = $this->request->getBody();
        $token = $data['token'];
        $file = $data['file'] ?? false;
        $user_id = $this->db->query("SELECT `user_id` FROM `users` WHERE `token` = '{$token}'")[0]['user_id'];
        
        // Add track
        if ($file) {
            $track_id = $this->db->query("SELECT `track_id` FROM `tracks` WHERE `location` = '{$file}'")[0]['track_id'];
            $if_exists = $this->db->query("SELECT `user_id`, `track_id` from `users_relations` where `user_id` = {$user_id} AND `track_id` = {$track_id}");            
            
            if (count($if_exists) != 0)
                echo 0;
            else {
                $this->db->query("INSERT INTO `users_relations` VALUES (NULL, {$user_id}, NULL, {$track_id})");
                echo 1;
            }

        // Add album
        } else if ($data['album']) {
            $album_id = $data['album'];
            $if_exists = $this->db->query("SELECT `user_id`, `album_id` from `users_relations` where `user_id` = {$user_id} AND `album_id` = {$album_id}");            
            
            if (count($if_exists) != 0)
                echo 0;
            else {
                $this->db->query("INSERT INTO `users_relations` VALUES (NULL, {$user_id}, {$album_id}, NULL)");
                echo 1;
            }
            
        } else {
            echo 'Error';
        }
    }

    public function getGroups() {
        echo json_encode($this->model->getFavGroups());
    }

    public function getAlbums() {
        echo json_encode($this->model->getFavAlbums());
    }

    public function getTracks() {
        echo json_encode($this->model->getFavTracks());
    }

}