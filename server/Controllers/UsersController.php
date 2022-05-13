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

}