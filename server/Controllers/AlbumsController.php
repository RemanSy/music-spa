<?php

namespace app\server\controllers;
use app\server\Controller;
use app\server\models\Album;
use app\server\models\Track;

class AlbumsController extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new Album();
    }

    public function get() {
        $this->response->GETHeaders();
        $id = $this->request->getBody()['id'] ?? false;

        if (!$id) {
            $data = $this->db->query("SELECT `album_id`, `albums`.`title`, `groups`.`title` as `group`, `genres`.`name` as `genre`, `year`, `albums`.`image`, `albums`.`created_at`, `albums`.`updated_at` 
            FROM `albums` 
                JOIN `groups` 
                    ON `albums`.`_group` = `groups`.`group_id` 
                JOIN `genres` 
                    ON `albums`.`genre` = `genres`.`genre_id`");
        } else {
            $data = $this->db->query("SELECT `album_id`, `albums`.`title`, `groups`.`title` as `group`, `genres`.`name` as `genre`, `year`, `albums`.`image`, `albums`.`created_at`, `albums`.`updated_at` 
            FROM `albums` 
                JOIN `groups` 
                    ON `albums`.`_group` = `groups`.`group_id` 
                JOIN `genres` 
                    ON `albums`.`genre` = `genres`.`genre_id`
            WHERE `albums`.`album_id` = {$id}");
        }

        if (count($data) < 0) $data = ['message' => 'Альбомы не найдены'];
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function group() {
        $this->response->GETHeaders();

        $groups = $this->db->query("SELECT `group_id`, `title` FROM `groups`");

        foreach ($groups as &$group)
            $group['albums'] = $this->db->query("SELECT `album_id`, `title`, `genres`.`name` as `genre` FROM `albums` JOIN `genres` ON `genres`.`genre_id` = `albums`.`genre` WHERE `albums`.`_group` = {$group['group_id']}");
        
        echo json_encode($groups, JSON_UNESCAPED_UNICODE);
    }

    public function getTracks() {
        $this->response->GETHeaders();

        $id = $this->request->getBody()['id'];
        
        $tracks = $this->db->query("SELECT `tracks`.`track_id`, `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `location` 
        FROM `tracks` 
            JOIN `albums` 
                ON `tracks`.`album` = `albums`.`album_id` 
            JOIN `groups` 
                ON `tracks`.`_group` = `groups`.`group_id` 
        WHERE `albums`.`album_id` = {$id}");

        if (!$tracks) echo ('Треки не найдены');

        echo json_encode($tracks, JSON_UNESCAPED_UNICODE);
    }

    public function add() {
        $this->response->POSTHeaders();

        $data = $this->request->getBody();
        $trackModel = new Track;

        extract($data);

        if (!isset($data['albumTitle']) || !isset($data['group']) || !isset($data['genre']) || !isset($data['year']) || !isset($files)) {
            $this->response->responseCode(400);

            echo json_encode(['message' => 'Not enough data']);
            exit;
        }

        $this->model->title = $data['albumTitle'];
        $this->model->_group = $data['group'];
        $this->model->genre = $data['genre'];
        $this->model->year = $data['year'];
        $this->model->image = $this->model->uploadFile($files['image']);

        $tracks = $files['file'];
        // Converted tracks
        $files = [];
        $fileCount = count($tracks['name']);
        $fileKeys = array_keys($tracks);

        // Convert files array
        for ($i = 0; $i < $fileCount; $i++)
            foreach ($fileKeys as $key)
                $files[$i][$key] = $tracks[$key][$i];
        
        if (!$this->model->save()) {
            $this->response->responseCode(400);
            echo json_encode(['message' => 'Error saving data']);
            exit;
        }
        
        $albumId = $this->model->lastInsertId();
        $groupId = $data['group'];

        for ($i = 0; $i < count($data['title']); $i++) {
            $trackModel->title = $data['title'][$i];
            $trackModel->_group = $groupId;
            $trackModel->album = $albumId;
            $trackModel->duration = $data['duration'][$i];
            $trackModel->location = $this->model->uploadFile($files[$i]);
            if (!$trackModel->save()) throw new \Exception("Error uploading track");
        }

        $this->response->responseCode(200);
    }

}