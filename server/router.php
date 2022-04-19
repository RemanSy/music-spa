<?php

namespace app\server;

class Router {
    public Request $request;
    private array $get;
    private array $post;
    private array $put;
    private array $delete;
    private array $global = [];

    public function __construct() {
        $this->request = new Request();
    }

    public function get($path, $callback) {
        $this->regCallback('get', $path, $callback);
    }

    public function post($path, $callback) {
        $this->regCallback('post', $path, $callback);
    }

    public function put($path, $callback) {
        $this->regCallback('put', $path, $callback);
    }

    public function delete($path, $callback) {
        $this->regCallback('delete', $path, $callback);
    }

    public function regCallback($method, $path, $callback) {
        if (is_int(strpos($path, '@')))
            return $this->global[$method][$path] = $callback;

        return $this->$method[$path] = $callback;
    }

    public function resolve() {
        $uri = $this->request->getUri();
        $method = strtolower($this->request->getRequestMethod());
        $callback = $this->$method[$uri] ?? null;

        if (isset($this->global[$method])) {
            foreach ($this->global[$method] as $preg => $cbck) {
                if (preg_match($preg, $uri)) {
                    $callback = $cbck;
                    break;
                }
            }
        }

        // if (array_key_exists('/', $this->global) && (!isset(explode('/', $uri)[2]) || explode('/', $uri)[2] == ''))
        //     $callback = $this->global['/'][$method];

        if (!isset($callback)) {
            echo 'Page doesn\'t exist';
            exit;
        }

        if (is_array($callback)) $callback[0] = new $callback[0]();

        call_user_func($callback);
    }
}