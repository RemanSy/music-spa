<?php

namespace app\server\models;
use app\server\Model;

class Group extends Model {
    protected string $table = 'groups';

    public function __construct() {
        parent::__construct();
    }

    public function getAlbums() {
        $primaryKey = $this->primary_key;
        $id = $this->$primaryKey;
        
        return $this->db->query("SELECT `album_id`, `albums`.`title`, `groups`.`title` as `group`, `genres`.`name` as `genre`, `albums`.`image` 
        FROM `albums` 
        INNER JOIN `groups`
            ON `albums`.`_group` = `groups`.`group_id`
        INNER JOIN `genres`
            ON `albums`.`genre` = `genres`.`genre_id`
        WHERE `albums`.`_group` = {$id}");
    }

    public function getTracks() {
        $primaryKey = $this->primary_key;
        $id = $this->$primaryKey;
        
        return $this->db->query("SELECT `track_id`, `tracks`.`title`, `groups`.`title` as `group`, `albums`.`title` as `album`, `duration`, `location` 
        FROM `tracks` 
        INNER JOIN `groups`
            ON `groups`.`group_id` = `tracks`.`_group`
        INNER JOIN `albums`
            ON `albums`.`album_id` = `tracks`.`album`
        WHERE `tracks`.`_group` = {$id}");
    }
}