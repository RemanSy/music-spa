<?php

namespace app\server\controllers;
use app\server\Controller;
use app\server\models\Group;

class GroupsController extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new Group();
    }

    public function get() {
        $data = $this->model->get();

        $this->response->GETHeaders();
        
        echo json_encode($data);
    }

    public function add() {
        $data = $this->request->getBody();
        
        extract($data);

        $this->model->title = $data['title'];
        $this->model->country = $data['country'];
        $this->model->image = $this->model->uploadFile($files['cover']);
        
        $this->model->save($data);
    }

    public function search() {
        $search = $this->request->getBody()['query'] ?? null;

        if ($search == null) throw new \Exception('Query can\'t be null');

        $res = $this->db->query("SELECT `group_id`, `title` FROM `groups` WHERE `title` LIKE '%{$search}%'");

        echo json_encode($res);
    }

}