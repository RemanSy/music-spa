<?php

namespace app\server\controllers;
use app\server\Controller;
use app\server\models\Track;
use app\server\models\Group;

class TracksController extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new Track();
    }

    public function get() {
        $data = $this->model->get();

        if (count($data) < 0) $data = ['message' => 'Треки не найдены'];

        $this->response->GETHeaders();
        // print_r($_SERVER);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function getOne() {
        $id = $this->request->getBody()['id'];
        $this->model->track_id = $id;
        $this->model->getOne();
        
        $this->response->GETHeaders();
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function add() {
        $this->response->POSTHeaders();

        $data = $this->request->getBody();
        
        extract($data);

        if (!isset($data['title']) || !isset($data['_group']) || !isset($data['duration']) || !isset($files)) {
            $this->response->responseCode(400);

            echo json_encode(['message' => 'Not enough data']);
            exit;
        }

        $this->model->title = $data['title'];
        $this->model->_group = $data['_group'];
        $this->model->duration = $data['duration'];
        $this->model->location = $this->model->uploadFile($files['file']);
        
        if (!$this->model->save()) {
            $this->response->responseCode(400);
            echo json_encode(['message' => 'Error saving data']);
            exit;
        }

        $this->response->responseCode(200);
    }

}