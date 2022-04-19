<?php

namespace app\server;

class Response {
    public function setHeader($h) {
        header($h);
    }

    public function responseCode($c) {
        http_response_code($c);
    }

    public function redirect($url) {
        header("Location: {$url}");
    }

    public function GETHeaders() {
        $this->setHeader('Access-Control-Allow-Origin: *');
        $this->setHeader('Content-type: application/json; charset=utf8');
    }

    public function POSTHeaders() {
        $this->setHeader("Access-Control-Allow-Origin: *");
        $this->setHeader("Content-Type: application/json; charset=UTF-8");
        $this->setHeader("Access-Control-Allow-Methods: POST");
        $this->setHeader("Access-Control-Max-Age: 3600");
        $this->setHeader("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }
}