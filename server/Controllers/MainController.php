<?php

namespace app\server\controllers;
use app\server\Controller;

// Test use
use app\server\models\Track;

class MainController extends Controller {
    public function __construct() {
        parent::__construct();
    }

    public function test() {
        $t = new Track();
        echo '<pre>';
        print_r($t);
        echo '</pre>';
    }

    public function index() {
        echo $this->view->getTemplate('main');
    }

    public function nav() {
        echo $this->view->getTemplate('nav');
    }

    public function countries() {
        $search = $this->request->getBody()['query'] ?? null;

        if ($search == null) throw new \Exception('Query can\'t be null');

        $res = $this->db->query("SELECT * FROM `countries` WHERE `name` LIKE '{$search}%'");

        echo json_encode($res);
    }

    public function genres() {
        $search = $this->request->getBody()['query'] ?? null;

        if ($search == null) throw new \Exception('Query can\'t be null');

        $res = $this->db->query("SELECT * FROM `genres` WHERE `name` LIKE '%{$search}%'");

        echo json_encode($res);
    }
}