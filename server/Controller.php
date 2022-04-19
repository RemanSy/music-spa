<?php

namespace app\server;
use app\server\View;
use app\server\Database;
use app\server\Request;
use app\server\Response;

class Controller {
    protected function __construct() {
        $this->db = new Database();
        $this->view = new View();
        $this->request = new Request();
        $this->response = new Response();
    }

    public function render($view, $data = []) {
        return $this->view->renderView($view, $data);
    }
}