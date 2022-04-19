<?php

namespace app\server;

class Request {

    public function getRequestMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function getUri() {
        $requestUri = $_SERVER['REQUEST_URI'];
        $qp = strpos($requestUri, '?');
        if (!$qp) return $requestUri;
        else return substr($requestUri, 0, $qp);
    }

    public function getBody() {
        $req = $this->getRequestMethod();
        
        switch($req) {
            case 'GET':
                return $_GET;

            case 'POST':
                if (!empty($_FILES))
                    return ['files' => $_FILES, 'data' => $_POST];
                
                return $_POST;
                
            case 'PUT':
                return json_decode(file_get_contents('php://input'), true);
                
            default:
                return false;
        }

    }
}