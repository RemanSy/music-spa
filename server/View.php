<?php

namespace app\server;

class View {
    public function renderView($view, $data = []) {
        $template = $this->getTemplate('main', $data['title'] ?? 'zvuk');
        $view = $this->getView($view, $data);

        return str_replace('{{content}}', $view, $template);
    }

    public function getView($view, $data = []) {
        try {
            ob_start();
            require_once '../Views/' . $view . '.php';
            return ob_get_clean();
        } catch (\Throwable $th) {
            echo 'View doesn\'t exist';
            exit;
        }
    }

    public function getTemplate($template, $title = 'zvuk') {
        try {
            ob_start();
            require_once '../Views/templates/' . $template  . '.php';
            return ob_get_clean();
        } catch (\Throwable $th) {
            echo 'Template doesn\'t exist';
            exit;
        }
    }
}