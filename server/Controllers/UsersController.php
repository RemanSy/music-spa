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

        $this->response->setCookie('role', 1, time() + 7200);

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
        if (!isset($_COOKIE['user'])) {
            echo 0;
            return;
        }

        $res = $this->model->where('token', '=', $_COOKIE['user']);

        echo count($res);
    }

    public function addFavorite() {
        $data = $this->request->getBody();
        $token = $_COOKIE['user'];
        $file = $data['file'] ?? false;
        $album = $data['album'] ?? false;
        $group = $data['group'] ?? false;
        $user_id = $this->getIdByToken($token);

        // Add track
        if ($file) {
            $track_id = $this->db->query("SELECT `track_id` FROM `tracks` WHERE `location` = '{$file}'")[0]['track_id'];
            $if_exists = $this->db->query("SELECT `user_id`, `track_id` from `users_relations` where `user_id` = {$user_id} AND `track_id` = {$track_id}");            
            
            if (count($if_exists) != 0) {
                $this->db->query("DELETE FROM `users_relations` WHERE `track_id` = {$track_id} AND `user_id` = {$user_id}");
                echo 0;
            } else {
                $this->db->query("INSERT INTO `users_relations` VALUES (NULL, {$user_id}, NULL, NULL, {$track_id})");
                echo 1;
            }

        // Add album
        } else if ($album) {
            $if_exists = $this->db->query("SELECT `user_id`, `album_id` from `users_relations` where `user_id` = {$user_id} AND `album_id` = {$album}");            
            
            if (count($if_exists) != 0) {
                $this->db->query("DELETE FROM `users_relations` WHERE `album_id` = {$album} AND `user_id` = {$user_id}");
                echo 0;
            } else {
                $this->db->query("INSERT INTO `users_relations` VALUES (NULL, {$user_id}, NULL, {$album}, NULL)");
                echo 1;
            }
        
        // Add group
        } else if ($group) {
            $if_exists = $this->db->query("SELECT `user_id`, `album_id` from `users_relations` where `user_id` = {$user_id} AND `group_id` = {$group}");            
            
            if (count($if_exists) != 0) {
                $this->db->query("DELETE FROM `users_relations` WHERE `group_id` = {$group_id} AND `user_id` = {$user_id}");
                echo 0;
            } else {
                $this->db->query("INSERT INTO `users_relations` VALUES (NULL, {$user_id}, {$group}, NULL, NULL)");
                echo 1;
            }

        // Error
        } else {
            echo 'Error';
        }
    }

    public function getGroups() {
        $tk = $_COOKIE['user'];
        $this->model->user_id = $this->getIdByToken($tk);

        echo json_encode($this->model->getFavGroups(), JSON_UNESCAPED_UNICODE);
    }

    public function getAlbums() {
        $tk = $_COOKIE['user'];
        $this->model->user_id = $this->getIdByToken($tk);

        echo json_encode($this->model->getFavAlbums(), JSON_UNESCAPED_UNICODE);
    }

    public function getTracks() {
        $tk = $_COOKIE['user'] ?? false;
        if (!$tk) return false;

        $this->model->user_id = $this->getIdByToken($tk);

        echo json_encode($this->model->getFavTracks(), JSON_UNESCAPED_UNICODE);
    }

    public function getIdByToken($token) {
        return $this->db->query("SELECT `user_id` FROM `users` WHERE `token` = '{$token}'")[0]['user_id'];
    }
}