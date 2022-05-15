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
        $this->response->GETHeaders();
        $id = $this->request->getBody()['id'] ?? false;

        if (!$id) {
            $data = $this->db->query("SELECT `group_id`, `groups`.`title`, `countries`.`name`, `groups`.`image`
            FROM `groups` 
                JOIN `countries` 
                    ON `groups`.`country` = `countries`.`country_id`");
        } else {
            $data = $this->db->query("SELECT `group_id`, `groups`.`title`, `countries`.`name`, `groups`.`image`
            FROM `groups` 
                JOIN `countries` 
                    ON `groups`.`country` = `countries`.`country_id`
            WHERE `groups`.`group_id` = $id");
        }

        if (count($data) < 0) $data = ['message' => 'Группы не найдены'];
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
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

    public function tracks() {
        $id = $this->request->getBody()['id'] ?? false;
        if (!$id) {
            echo 'Invalid id';
            return;
        };

        $this->model->group_id = $id;
        echo json_encode($this->model->getTracks());
    }

    public function albums() {
        $id = $this->request->getBody()['id'] ?? false;
        if (!$id) {
            echo 'Invalid id';
            return;
        };

        $this->model->group_id = $id;
        echo json_encode($this->model->getAlbums());
    }

}