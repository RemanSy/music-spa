<?php

namespace app\server\models;
use app\server\Model;

class Track extends Model {
    protected string $table = 'tracks';

    public function __construct() {
        parent::__construct();
    }

    public function get() {
        return $this->db->query("SELECT 
        `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `albums`.`image` as `cover`, `location` 
        FROM `tracks` 
            JOIN `albums` 
                ON `tracks`.`album` = `albums`.`album_id` 
            JOIN `groups` 
                ON `tracks`.`_group` = `groups`.`group_id`");
    }

    public function getOne() {
        $query = $this->db->prepare("SELECT 
        `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `albums`.`image` as `cover`, `location` 
        FROM `tracks` 
            JOIN `albums` 
                ON `tracks`.`album` = `albums`.`album_id` 
            JOIN `groups` 
                ON `tracks`.`_group` = `groups`.`group_id`
        WHERE 
            `track_id` = ?
        LIMIT
            0, 1");

        $query->bindParam(1, $this->track_id);

        $row = $this->db->fetch($query)[0];

        $this->title = $row['title'];
        $this->_group = $row['group'];
        $this->album = $row['album'];
        $this->duration = $row['duration'];
        $this->location = $row['location'];
    }

    public function album($id) {
        return $this->db->query("SELECT 
        `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `location` 
        FROM `tracks` 
            JOIN `albums` 
                ON `tracks`.`album` = `albums`.`album_id` 
            JOIN `groups` 
                ON `tracks`.`_group` = `groups`.`group_id` 
            WHERE `albums`.`album_id` = {$id}");
    }
}